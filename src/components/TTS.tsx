import * as React from "react";
const electron = require('electron');
const auth = require('google-auth-library');
const keys = require('../client_secret.json');
const textToSpeech = require('@google-cloud/text-to-speech');
import * as protos from "@google-cloud/text-to-speech/build/protos/protos"
const fs = require('fs');
const util = require('util');
const http = require('http');
const url = require('url');
const destroyer = require('server-destroy');

type TTSProps = {
  text: string
  gender: boolean
  genderCallback: (ev: React.MouseEvent) => void
}

type TTSState = {
  audio_num: number
}

class TTS extends React.Component<TTSProps, TTSState> {

  oauth2client: any;
  audioElement: HTMLMediaElement;
  processing: boolean;


  constructor(props: any) {
    super(props);
    this.state = {
      audio_num: 1
    }

    this.oauth2client = new auth.OAuth2Client(keys.web.client_id, keys.web.client_secret, "http://localhost:8080/oauth2callback");
    this.processing = false;

    this.authenticate = this.authenticate.bind(this);
    this.speak = this.speak.bind(this);
    this.stop = this.stop.bind(this);

    this.authenticate();
  }

  stop() {
    this.audioElement.pause();
    this.audioElement.currentTime = 0;
    this.audioElement.remove();
  }

  alreadyPlaying() {
    if (this.audioElement && !this.audioElement.paused && !this.audioElement.ended && 0 < this.audioElement.currentTime) {
      console.log("playing audio");
      return true;
    }
  }

  async speak() {
    if (this.processing) {
      console.log("processing");
      return true
    }
    if (this.alreadyPlaying()) {
      this.stop();
    }

    this.processing = true;

    console.log(this.oauth2client);
    // Creates a client
    const client = new textToSpeech.TextToSpeechClient({auth: this.oauth2client});
      // The text to synthesize

    if (this.props.gender == true) {
      // Construct the request
      var request = {
        input: {text: this.props.text},
        // Select the language and SSML Voice Gender (optional)
        voice: {languageCode: 'en-US', name: "en-US-Wavenet-A", ssmlGender: protos.google.cloud.texttospeech.v1.SsmlVoiceGender.MALE},
        // Select the type of audio encoding
        audioConfig: {
          audioEncoding: protos.google.cloud.texttospeech.v1.AudioEncoding.MP3,
          sampleRateHertz: 44100
        },
      };
    } else {
      // Construct the request
      var request = {
        input: {text: this.props.text},
        // Select the language and SSML Voice Gender (optional)
        voice: {languageCode: 'en-US', name: "en-US-Wavenet-F", ssmlGender: protos.google.cloud.texttospeech.v1.SsmlVoiceGender.FEMALE},
        // Select the type of audio encoding
        audioConfig: {
          audioEncoding: protos.google.cloud.texttospeech.v1.AudioEncoding.MP3,
          sampleRateHertz: 44100
        },
      };
    }
    

    // Performs the text-to-speech request
    const [response] = await client.synthesizeSpeech(request);

    // Write the binary audio content to a local file
    const writeFile = util.promisify(fs.writeFile);
    await writeFile('dist/output.mp3', response.audioContent, 'binary');
    console.log('Audio content written to file: output.mp3'); 

    this.audioElement = new Audio('output.mp3?v=' + this.state.audio_num.toString());
    console.log(this.audioElement);
    this.audioElement.load();
    this.audioElement.play();
    this.setState((prevstate) => {
      return {audio_num: prevstate.audio_num + 1}
    })
    this.processing = false;
  }  

  async authenticate() {
    const authUrl = this.oauth2client.generateAuthUrl({
      access_type: 'offline',
      scope: [
        'https://www.googleapis.com/auth/cloud-platform'
      ]
    });

    // Create the browser window.
    const win = new electron.remote.BrowserWindow({
      height: 600,
      width: 800
    });
    
    const server = http
      .createServer(async (req: any, res: any) => {
        try {
          if (req.url.indexOf('/oauth2callback') > -1) {
            // acquire the code from the querystring, and close the web server.
            const qs = new url.URL(req.url, 'http://localhost:8080')
              .searchParams;
            const code = qs.get('code');
            console.log(`Code is ${code}`);
            res.end('Authentication successful! Please return to the console.');
            win.close();
            server.destroy();
 
            // Now that we have the code, use that to acquire tokens.
            const r = await this.oauth2client.getToken(code);
            // Make sure to set the credentials on the OAuth2 client.
            this.oauth2client.setCredentials(r.tokens);
            console.log("Access Token: " + this.oauth2client.credentials.access_token)
            console.info('Tokens acquired.');

            const tokenInfo = await this.oauth2client.getTokenInfo(this.oauth2client.credentials.access_token);
            // take a look at the scopes originally provisioned for the access token
            console.log(tokenInfo);

            Promise.resolve(this.oauth2client);
          }
        } catch (e) {
          Promise.reject(e);
        }
      })
      .listen(8080, () => {
        // open the browser to the authorize url to start the workflow
        win.loadURL(authUrl, {userAgent: 'Chrome'});
      });
    destroyer(server);
  }

  getGender() {
    if(this.props.gender) {
      return "MALE"
    } else {
      return "FEMALE"
    }
  }

  render() { 
      return (
      <>
        <a className="speak-btn waves-effect waves-light btn" onClick={this.speak}>Speak</a>
        <a className="stop-btn waves-effect waves-light btn red" onClick={this.stop}>Stop</a>
        <a className="gender-btn waves-effect waves-light btn" onClick={this.props.genderCallback}>{this.getGender()}</a>
      </>
      )
  }
}

export default TTS;