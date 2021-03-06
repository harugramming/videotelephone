
// カメラ映像の縮小化
$('#my-video').on('click',function(){
  console.log("ok");
// 相手の画面が表示されている場合のみ有効
if($('#their-video').length){
  if($('#my-video').hasClass('big_view')){
      $('#my-video').removeClass('big_view');
      $('#my-video').addClass('small_view');
      $('#their-video').addClass('big_view');
      $('#their-video').removeClass('small_view');
  }else{
    $('#my-video').addClass('big_view');
    $('#my-video').removeClass('small_view');
    $('#their-video').removeClass('big_view');
    $('#their-video').addClass('small_view');
  }
}else{} //相手の画面が表示されていない場合、何もしない
});

$('body').on('click', '#their-video' , function() {
  if($('#their-video').hasClass('big_view')){
    $('#their-video').removeClass('big_view');
    $('#their-video').addClass('small_view');
    $('#my-video').addClass('big_view');
    $('#my-video').removeClass('small_view');
  }else{
    $('#their-video').addClass('big_view');
    $('#their-video').removeClass('small_view');
    $('#my-video').removeClass('big_view');
    $('#my-video').addClass('small_view');
  }
});

// カメラ、マイク、音声のON,OFF切り替え
const toggleCamera = document.getElementById('js-toggle-camera');
const toggleMicrophone = document.getElementById('js-toggle-microphone');
const toggleVolume = document.getElementById('js-toggle-volume');

toggleCamera.addEventListener('click', () => {
  const videoTracks = localStream.getVideoTracks()[0];
  videoTracks.enabled = !videoTracks.enabled;
});

toggleMicrophone.addEventListener('click', () => {
  const audioTracks = localStream.getAudioTracks()[0];
  audioTracks.enabled = !audioTracks.enabled;
});
toggleVolume.addEventListener('click', () => {
  const their_videoTracks = document.getElementById('their-video');
  if(their_videoTracks){
    their_videoTracks.muted = false;
  }else{
    their_videoTracks.muted = true;
  }
});

// ボタンのレイアウトの変更
//fontawesomeのクラスの付与によってレイアウトを変更
$('#js-toggle-microphone').on('click',function(){
  if($('#js-toggle-microphone i').hasClass('fa-microphone')){
    $('#js-toggle-microphone i').removeClass('fa-microphone');
    $('#js-toggle-microphone i').addClass('fa-microphone-slash');
  }else{
    $('#js-toggle-microphone i').addClass('fa-microphone');
    $('#js-toggle-microphone i').removeClass('fa-microphone-slash');
  }
});
$('#js-toggle-camera').on('click',function(){
  if($('#js-toggle-camera i').hasClass('fa-video')){
    $('#js-toggle-camera i').removeClass('fa-video');
    $('#js-toggle-camera i').addClass('fa-video-slash');
  }else{
    $('#js-toggle-camera i').addClass('fa-video');
    $('#js-toggle-camera i').removeClass('fa-video-slash');
  }
});
$('#js-toggle-volume').on('click',function(){
  if($('#js-toggle-volume i').hasClass('fa-volume-up')){
    $('#js-toggle-volume i').removeClass('fa-volume-up');
    $('#js-toggle-volume i').addClass('fa-volume-mute');
  }else{
    $('#js-toggle-volume i').addClass('fa-volume-up');
    $('#js-toggle-volume i').removeClass('fa-volume-mute');
  }
});
let localStream;

//Peer作成
  const peer = new Peer({
  key: '11eaef3c-0969-41bf-9aa0-a489153871df',
  debug: 3
});
peer.on('open', () => {
  document.getElementById('my-id').textContent = peer.id;
});

// カメラ映像取得
navigator.mediaDevices.getUserMedia({video: true, audio: true})
  .then( stream => {
  // 成功時にvideo要素にカメラ映像をセットし、再生
  const videoElm = document.getElementById('my-video');
  videoElm.srcObject = stream;
  videoElm.play();
  // 着信時に相手にカメラ映像を返せるように、グローバル変数に保存しておく
  localStream = stream;

  //カメラの初期状態はOFFにしておこう
  localStream.getVideoTracks()[0].enabled = !localStream.getVideoTracks()[0].enabled;

}).catch( error => {
  // 失敗時にはエラーログを出力
  console.error('mediaDevice.getUserMedia() error:', error);
  return;
});


// 発信処理
document.getElementById('make-call').onclick = () => {
const theirID = document.getElementById('their-id').value;
const mediaConnection = peer.call(theirID, localStream);
setEventListener(mediaConnection);
};



// イベントリスナを設置する関数
const setEventListener = mediaConnection => {
mediaConnection.on('stream', stream => {
  //自分のカメラは縮小化
  $('#my-video').removeClass('big_view');
  $('#my-video').addClass('small_view');
  //相手のカメラを表示
  $('#my-video').before("<video id='their-video' class='big_view' width='400px' autoplay playsinline></video>");
  // video要素にカメラ映像をセットして再生
  const videoElm = document.getElementById('their-video')
  videoElm.srcObject = stream;
  videoElm.play();
});
}

//着信処理
peer.on('call', mediaConnection => {
mediaConnection.answer(localStream);
setEventListener(mediaConnection);

});
