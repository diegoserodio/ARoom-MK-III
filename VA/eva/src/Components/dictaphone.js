import React, { Component } from "react";
import PropTypes from "prop-types";
import SpeechRecognition from "react-speech-recognition";
import Process from './process'

const propTypes = {
  // Props injected by SpeechRecognition
  transcript: PropTypes.string,
  finalTranscript: PropTypes.string,
  resetTranscript: PropTypes.func,
  browserSupportsSpeechRecognition: PropTypes.bool,
  stopListening: PropTypes.func,
};

const Dictaphone = ({
  transcript,
  finalTranscript,
  resetTranscript,
  browserSupportsSpeechRecognition,
  stopListening
}) => {
  if (!browserSupportsSpeechRecognition) {
    return null;
  }
  if(finalTranscript!=''){
    let command = finalTranscript;
    resetTranscript();
    return <Process command={command}/>
  }
  return <Process command=''/>
};

Dictaphone.propTypes = propTypes;

export default SpeechRecognition(Dictaphone);
