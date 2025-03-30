from flask import Flask, request, jsonify
from flask_cors import CORS
from pymongo import MongoClient
import logging
from dotenv import load_dotenv
import os

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
    jobs = db['jobs']
    logger.info("Successfully connected to MongoDB Atlas")
    print("Successfully connected to MongoDB Atlas")
except Exception as e:
    logger.error(f"Failed to connect to MongoDB Atlas: {str(e)}")
    raise

@app.route('/shortlistCandidates', methods=['POST'])
def shortlist_candidates():
    try:
        # Get request data
        data = request.get_json()
        job_id = data.get('jobId')
        job_description = data.get('jobDescription')

        print("Data: ", data)

        if not job_id or not job_description:
            return jsonify({
                'status': 'error',
                'message': 'Missing jobId or jobDescription in request body'
            }), 400

        logger.info(f"Received request for jobId: {job_id}")
        
        # Find the job in MongoDB
        job = jobs.find_one({'humanReadableJobId': str(job_id)})
        
        if not job:
            return jsonify({
                'status': 'error',
                'message': f'Job not found with ID: {job_id}'
            }), 404
        
        # create an array of dummy json with int score, email, summary and status
        shortlisted_candidates = [
            {
                'score': 85,
                'emailId': 'siddanth.manoj@gmail.com ',
                'summary': 'Siddanth Manoj has a strong background in software development and is a quick learner.'
            },
            {
                'score': 75,
                'emailId': 'sawant.tanishqa@gmail.com',
                'summary': 'Tanishqa Sawant has a strong background in software development and is a quick learner.'
            },
            {
                'score': 65,
                'emailId': 'krishmanghani@gmail.com',
                'summary': 'Krish Manghani has a strong background in software development and is a quick learner.'
            }
        ]

        # store the shortlisted candidates in the job collection with the column name allCandidatesRankingPhase1
        jobs.update_one(
            {'humanReadableJobId': str(job_id)},
            {'$set': {'allCandidatesRankingPhase1': shortlisted_candidates}}
        )

        print("Updated the job collection with the shortlisted candidates", shortlisted_candidates)

        return jsonify({
            'status': 'success',
            'message': 'Candidates Shortlisted Successfully',
            'data': {
                'shortlistedCandidates': shortlisted_candidates
            }
        })

    except Exception as e:
        logger.error(f"Error in shortlist_candidates: {str(e)}")
        logger.error("Traceback:", exc_info=True)
        return jsonify({
            'status': 'error',
            'message': f'Error processing request: {str(e)}'
        }), 500

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5001)
