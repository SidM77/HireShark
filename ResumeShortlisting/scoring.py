from flask import Flask, request, jsonify
from flask_cors import CORS
from pymongo import MongoClient
import logging
from dotenv import load_dotenv
import os
import requests
import re

# Load environment variables
load_dotenv()

app = Flask(__name__)
CORS(app)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# MongoDB Atlas Configuration
try:
    # Get MongoDB Atlas connection string from environment variable
    MONGODB_URI = os.getenv('MONGODB_URI')
    if not MONGODB_URI:
        raise ValueError("MONGODB_URI environment variable is not set")
    
    # Connect to MongoDB Atlas
    client = MongoClient(MONGODB_URI)
    # Test the connection
    client.server_info()
    
    # Get database and collection
    db = client['mailHandler']
    jobs_collection = db['jobs']
    mail_handler_collection = db['mailHandler']
    logger.info("Successfully connected to MongoDB Atlas")
    print("Successfully connected to MongoDB Atlas")
except Exception as e:
    logger.error(f"Failed to connect to MongoDB Atlas: {str(e)}")
    raise

# Function to generate text using Ollama
def ollama_generate(prompt):
    endpoint = "http://localhost:11434/api/generate"
    payload = {"model": "deepseek-r1:8b", "prompt": prompt, "stream": False}
    try:
        response = requests.post(endpoint, json=payload)
        if response.status_code == 200:
            return response.json()['response']
        else:
            return f"Error: {response.status_code}"
    except Exception as e:
        logger.error(f"Error calling Ollama API: {str(e)}")
        return f"Error: {str(e)}"

# Function to evaluate the resume against the job description
def evaluate_candidate(resume_content, job_description):
    prompt = f"""
Please analyze the following resume in the context of the job description provided. Strictly check every single line in job description and analyze my resume whether there is a match exactly. Strictly maintain high ATS standards and give scores only to the correct ones. Focus on hard skills which are missing and also soft skills which are missing. Provide the following details.:
1. The match percentage of the resume to the job description. Display this.
2. Final thoughts on the resume's overall match with the job description in 3 lines.
Please display in the above order don't mention the numbers like 1. 2. etc and strictly follow ATS standards so that analysis will be accurate. Strictly follow the above templates omg. don't keep changing every time.
Strictly follow the above things and template which has to be displayed and don't keep changing again and again. Don't fucking change the template from above.
Title should be Resume analysis and maintain the same title for all. Also if someone uploads the same unchanged resume twice, keep in mind to give the same results. Display new ones only if they have changed their resume according to your suggestions or at least few changes.
Job Description: {job_description}
Resume: {resume_content}

Expected Output:
Matching Score: ""
Missing Keywords: ""
Final Thought: ""
(noting extra shouldn't be mentioned in the output expect above format)
"""
    return ollama_generate(prompt)

# Parse the resume analysis output
def parse_resume_analysis(input_text):
    # Step 1: Remove markdown like **, *, <think>, etc.
    cleaned_text = re.sub(r'[*_<>]+', '', input_text).strip()
    
    # Step 2: Extract matching score
    score_match = re.search(r'Matching Score[:\s]+(\d+)%', cleaned_text, re.IGNORECASE)
    matching_score = score_match.group(1) if score_match else 'N/A'
    
    # Step 3: Extract missing keywords
    keywords_match = re.search(r'Missing Keywords[:\s]+(.*?)Final Thought[:\s]+', cleaned_text, re.IGNORECASE | re.DOTALL)
    missing_keywords = keywords_match.group(1).strip() if keywords_match else 'None found'
    
    # Step 4: Extract final thought
    thought_match = re.search(r'Final Thought[:\s]+(.+)', cleaned_text, re.IGNORECASE | re.DOTALL)
    final_thought = thought_match.group(1).strip() if thought_match else 'No final thought provided.'
    
    # Combine insight
    insight = {
        'Missing Keywords': missing_keywords,
        'Final Thought': final_thought
    }
    
    try:
        # Convert score to integer if possible
        matching_score = int(matching_score)
    except ValueError:
        matching_score = 0
    
    return matching_score, insight

@app.route('/analyzeResumes', methods=['POST'])
def analyze_resumes():
    try:
        # Get request data
        data = request.get_json()
        job_id = data.get('jobId')
        
        if not job_id:
            return jsonify({
                'status': 'error',
                'message': 'Missing jobId in request body'
            }), 400
        
        logger.info(f"Received request for jobId: {job_id}")
        
        # Find the job in MongoDB
        job = jobs_collection.find_one({'humanReadableJobId': str(job_id)})
        
        if not job:
            return jsonify({
                'status': 'error',
                'message': f'Job not found with ID: {job_id}'
            }), 404
        
        # Get job description
        job_description = job.get('jobDescription', '')
        
        if not job_description:
            return jsonify({
                'status': 'error',
                'message': f'Job description not found for job ID: {job_id}'
            }), 404
        
        # Get specific email addresses to analyze
        target_emails = ['krishmanghani@gmail.com', 'king.rm63@gmail.com', 'siddanth.manoj@gmail.com']
        # target_emails = ['king.rm63@gmail.com']

        # Find resumes for these emails in mailHandler collection
        shortlisted_candidates = []
        
        for email in target_emails:
            mail_data = mail_handler_collection.find_one({'senderEmail': email})
            
            if mail_data and 'parsedResume' in mail_data:
                resume_text = mail_data.get('parsedResume', '')
                
                if resume_text:
                    # Analyze resume with DeepSeek
                    logger.info(f"Analyzing resume for email: {email}")
                    analysis_result = evaluate_candidate(resume_text, job_description)
                    
                    # Parse the analysis result
                    score, insight = parse_resume_analysis(analysis_result)
                    
                    # Add to shortlisted candidates
                    candidate_data = {
                        'score': score,
                        'emailId': email,
                        'summary': insight['Final Thought']
                    #     # 'missingKeywords': insight['Missing Keywords']
                    }
                    
                    shortlisted_candidates.append(candidate_data)
                    logger.info(f"Analysis completed for {email} with score: {score}")
                else:
                    logger.warning(f"Empty resume text for email: {email}")
            else:
                logger.warning(f"No data found for email: {email}")
        
        # Sort candidates by score (highest first)
        shortlisted_candidates.sort(key=lambda x: x['score'], reverse=True)
        
        # Update the job collection with the shortlisted candidates
        jobs_collection.update_one(
            {'humanReadableJobId': str(job_id)},
            [
                {'$set': {'phase': 2}},
                {'$set': {'allCandidatesRankingPhase1': shortlisted_candidates}}
            ]
        )
        
        logger.info(f"Updated job collection for job ID: {job_id}")
        
        return jsonify({
            'status': 'success',
            'message': 'Candidates Analyzed Successfully',
            'data': {
                'shortlistedCandidates': shortlisted_candidates
            }
        })
    
    except Exception as e:
        logger.error(f"Error in analyze_resumes: {str(e)}")
        logger.error("Traceback:", exc_info=True)
        return jsonify({
            'status': 'error',
            'message': f'Error processing request: {str(e)}'
        }), 500

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5001)