var recordButton, stopButton, recorder;


// navigator.mediaDevices.getUserMedia({audio:true})
// 	.then(stream => {
// 		rec = new MediaRecorder(stream);
// 		rec.ondataavailable = e => {
// 			audioChunks.push(e.data);
// 			if (rec.state == "inactive"){
//         let blob = new Blob(audioChunks,{type:'audio/x-mpeg-3'});
//         recordedAudio.src = URL.createObjectURL(blob);
//         recordedAudio.controls=true;
//         recordedAudio.autoplay=true;
//         audioDownload.href = recordedAudio.src;
//         audioDownload.download = 'mp3';
//         audioDownload.innerHTML = 'download';
//      }
// 		}
// 	})
// 	.catch(e=>console.log(e));
//
// startRecord.onclick = e => {
//   startRecord.disabled = true;
//   stopRecord.disabled=false;
//   audioChunks = [];
//   rec.start();
// }
//
// stopRecord.onclick = e => {
//   startRecord.disabled = false;
//   stopRecord.disabled=true;
//   rec.stop();
// }


// This example uses MediaRecorder to record from a live audio stream,
// and uses the resulting blob as a source for an audio element.
//
// The relevant functions in use are:
//
// navigator.mediaDevices.getUserMedia -> to get audio stream from microphone
// MediaRecorder (constructor) -> create MediaRecorder instance for a stream
// MediaRecorder.ondataavailable -> event to listen to when the recording is ready
// MediaRecorder.start -> start recording
// MediaRecorder.stop -> stop recording (this will generate a blob of data)
// URL.createObjectURL -> to create a URL from a blob, which we can use as audio src

window.onload = function () {
  recordButton = document.getElementById('record');
  stopButton = document.getElementById('stop');

  // get audio stream from user's mic
  navigator.mediaDevices.getUserMedia({
    audio: true
  })
  .then(function (stream) {
    recordButton.disabled = false;
    recordButton.addEventListener('click', startRecording);
    stopButton.addEventListener('click', stopRecording);
    recorder = new MediaRecorder(stream);

    // listen to dataavailable, which gets triggered whenever we have
    // an audio blob available
    recorder.addEventListener('dataavailable', download);
  });
};

function startRecording() {
  recordButton.disabled = true;
  stopButton.disabled = false;

  recorder.start();
}

function stopRecording() {
  recordButton.disabled = false;
  stopButton.disabled = true;

  // Stopping the recorder will eventually trigger the `dataavailable` event and we can complete the recording process
  recorder.stop();
}

function onRecordingReady(e) {
  var audio = document.getElementById('audio');
  // e.data contains a blob representing the recording
  audio.src = URL.createObjectURL(e.data);
  audio.play();
}

function download(e) {
  // var blob = new Blob(recordedChunks, {
  //   type: 'video/webm'
  // });
  var url = URL.createObjectURL(e.data);
  var a = document.createElement('a');
  document.body.appendChild(a);
  a.style = 'display: none';
  a.href = url;
  a.download = 'audio.webm';
  a.click();
  window.URL.revokeObjectURL(url);

  var sound = new Pizzicato.Sound({
      source: 'file',
      options: { path: './Downloads/audio.webm' }
  }, function() {
      console.log('sound file loaded!');
  });

  var distortion = new Pizzicato.Effects.Delay({
    gain: 0.4
  });
  sound.addEffect(delay);

  sound.play();
}
