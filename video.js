(function(window, document) {
  'use strict';
  var video = document.querySelector('video'),
      video_controls = document.querySelector('#video_controls'),
      play = document.querySelector('#play'),

      progress_container = document.querySelector('#progress'),
      progress_holder = document.querySelector('#progress_box'),
      play_progressBar = document.querySelector('#play_progress'),
      full_screen_toggle_button = document.querySelector('#full_screen'),
      currentTime = document.querySelector('.current_time'),
      duration = document.querySelector('.duration'),
      volume = document.querySelector('.volume'),
      seekBar = document.querySelector('#seek_bar'),
      volumeBar = document.querySelector('#volume_bar'),
      isVideoFullScreen = false,
      playProgressInterval,
      playTimeInterval;
  
  var videoPlayer = {
    init: function(){

      // this is equal to the videoPlayer object.
      var that = this;

      // Helpful CSS trigger for JS.
      document.documentElement.className = 'js';

      video.removeAttribute('controls');

      video.addEventListener('loadeddata', this.initializeControls, false);

      this.handleButtonPresses();

      full_screen_toggle_button.addEventListener('click', function() {
        isVideoFullScreen ? that.fullScreentOff() : that.fullScreenOn();
      }, false)

      this.seekprogress();
      this.volumeProgress();
      this.muteControl();
    },

    initializeControls: function() {

    },
    
    handleButtonPresses: function() {
      video.addEventListener('click', this.playPause, false)
      play.addEventListener('click', this.playPause, false)

      // When the play button is pressed,
      // Switch to the "Pause" Symbol.
      video.addEventListener('play', function() {
        play.title = 'Pause';
        play.innerHTML = '<span id="pauseButton">&#x2590;&#x2590;</span>';

        // Begin tracking video's progress.
        videoPlayer.trackPlayProgress();
        videoPlayer.trackTimeProgress();
      }, false)

      video.addEventListener('pause', function() {
        play.title = 'Play';
        play.innerHTML = '&#x25BA;';

        // video was paused, stop tracking progress.
        videoPlayer.stopTrackingPlayProgress();
      }, false);

      video.addEventListener('ended', function() {
        this.currentTime = 0;
        this.pause();
      }, false);
    },

    playPause: function() {
      if(video.paused || video.ended){
        if(video.ended){
          videoPlayer.reset();
        }
        video.play();
      } else {
        video.pause();
      }
    },

    reset: function(){
      video.currentTime = 0
      currentTime = '--:--';
      duration = '--:--';
    },

    fullScreenOn: function() {
      isVideoFullScreen = true;

      // Set new width according to windo width
      video.style.cssText = 'position:fixed; width:'+ window.innerWidth + 'px; height:'+window.innerHeight +'px;';

      // Apply a classname to the video and controls, if the designer needs it...
      video.className = 'fullsizeVideo';
      video_controls.className = 'fs-control';
      full_screen_toggle_button.className = 'fs-active control';

      // Listen for escap key. If pressed, close fullscreen.
      document.addEventListener('keydown', this.checkKeyCode, false);
    },

    fullScreentOff: function() {
      isVideoFullScreen = false;
      video.style.position = 'relative';

      video.className = '';
      full_screen_toggle_button.className = 'control'
      video_controls.className = '';
    },

    checkKeyCode : function( e ) {
      e = e || window.event;
      if( (e.keyCode || e.which) === 27 ) videoPlayer.fullScreentOff();
    },

    trackPlayProgress: function() {
      (function progressTrack(){
        videoPlayer.updatePlayProgress();
        playProgressInterval = setTimeout(progressTrack, 1000);
      })();
    },

    updatePlayProgress: function() {
      //play_progressBar.style.width = Math.floor( (video.currentTime / video.duration) * (progress_holder.offsetWidth)) + "px";
      var totalTime = (video.currentTime / video.duration) * 100;
      var totalPer = totalTime * progress_holder.offsetWidth;
      play_progressBar.style.width = totalTime + "%";
    },

    trackTimeProgress: function() {
      (function timeTrack(){
        videoPlayer.updateTimeProgress();
        playTimeInterval = setTimeout(timeTrack, 1000)
      })();
    },

    updateTimeProgress() {
      currentTime.textContent = videoPlayer.getCurrentTime(video.currentTime).toString();
      duration.textContent = videoPlayer.getCurrentTime(video.duration - video.currentTime).toString();
    },

    // Video was stopped, so stop updating progress.
    stopTrackingPlayProgress: function() {
      clearTimeout(playProgressInterval);
      clearTimeout(playTimeInterval);
    },

    getCurrentTime(time){
      var seconds = Math.floor( time % 60 ).toString();
      var minutes = Math.floor( (time/60) % 60 ).toString();
      if (seconds < 10){
        seconds = "0"+seconds
      }

      if (minutes < 10){
        minutes = "0"+minutes
      }

      return minutes +':'+seconds;
    },

    seekprogress() {
      seekBar.addEventListener('change', function() {
        // Calculating the new time
        var time = video.duration * (seekBar.value / 100);

        // Update the video time
        video.currentTime = time;
      });

      video.addEventListener('timeupdate', function() {
        // Calculate the slider value
        var value = (100 / video.duration) * video.currentTime;

        // Update the slider value
        seekBar.value = value;
      });

      // Pause the video when the slider handler is being dragged
      seekBar.addEventListener('mousedown', function() {
        video.pause();
      });

      seekBar.addEventListener('mouseup', function() {
        video.play();
      });
    },

    volumeProgress(){
      // Event listener for volume bar
      volumeBar.addEventListener('change', function() {
        // Update the video volume
        video.volume = volumeBar.value;
      })
    },

    muteControl(){
      volume.addEventListener('click', function(){
        if(video.muted){
          video.muted = false;
          volume.innerHTML = '<span class="fa fa-volume-up">';
        }else {
          video.muted = true;
          volume.innerHTML = '<span class="fa fa-volume-off">';
        }

      });
    },

  };

  //console.log(videoPlayer.getCurrentTime(33.33));

  videoPlayer.init();

}(this, document))