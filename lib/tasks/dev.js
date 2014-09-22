import forever from "forever-monitor";

import { watch } from "../gulp";
import { define } from "../procs";

define("dev/start", (config)=> {
  var server = new (forever.Monitor)(config.main);

  server.on("start", ()=> console.log("[DEV] Web server started"));
  server.on("restart", ()=> console.log("[DEV] Change detected, web server restarted"));
  server.on("exit", ()=> console.log("[DEV] Web server shut down"));

  watch(config.watch, (e)=> {
    console.log(e.path);
    server.restart();
  });

  server.start();
});
