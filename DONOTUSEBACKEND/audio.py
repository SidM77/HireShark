import speech_recognition as sr
import pyttsx3

r = sr.Recognizer()

def record_text():
    while(1):
        try:
            with sr.Microphone() as source2:
                r.adjust_for_ambient_noise(source2, duration = 10)

                audio2 = r.listen(source2)

                MyText = r.recognize_google(audio2)

                return MyText
        except sr.RequestError as e:
            print("Could nto request results; {0}".format(e))
        except sr.UnknownValueError:
            print("Unknown Error")



def output_text(text):
    f = open("output.txt", "a")
    f.write(text)
    f.write("\n")
    f.close()

    return

while(1):
    text = record_text()
    output_text(text)

    print("Wrote text")