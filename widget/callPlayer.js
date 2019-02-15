function callPlayer(frame_id, func, args) {
  if (window.jQuery && frame_id instanceof jQuery)
    frame_id = frame_id.get(0).id;
  var iframe = document.getElementById(frame_id);
  if (iframe && iframe.tagName.toUpperCase() != "IFRAME") {
    iframe = iframe.getElementsByTagName("iframe")[0];
  }
  if (iframe) {
    // Frame exists,
    iframe.contentWindow.postMessage(
      JSON.stringify({
        event: "command",
        func: func,
        args: args || [],
        id: frame_id
      }),
      "*"
    );
  }
}
