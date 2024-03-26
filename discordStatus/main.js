(function() {
    GMEdit.register("discord-status", {
        init: function(PluginState) {
            const DiscordRPC = require(PluginState.dir+"\\node_modules\\discord-rpc");
            const clientId = '831957674563993631';
            const rpc = new DiscordRPC.Client({ transport: 'ipc' });
            let startDate = Date.now();
            
            rpc.once('ready', () => {
                setActivity();
            });

            const keys = [
                ['GameMaker Project','GameMaker: Studio Project','GameMaker: Studio 2 Project'],
                ['gm8','gms1','gms2'],
            ];

            var activity = {
                details: "Start page",
                state: "Idling",
                instance: false,
                largeImageKey: "icon512",
                startTimestamp: startDate
            }

            async function setActivity() {
                if (!rpc) return;
                rpc.setActivity(activity);
            }

            rpc.login({ clientId }).catch(console.error);

            GMEdit.on("projectOpen", function(e) {
                activity.details = 'project: ' + e.project.displayName;
                activity.startTimestamp = startDate;
                let ver = $gmedit["gml.Project"].current.version.config.projectModeId;
                if (ver != 2 && ver != 1) {
                    ver = 0;
                }
                activity.smallImageKey = keys[1][ver],
                activity.smallImageText = keys[0][ver],
                rpc.setActivity(activity);
            });

            GMEdit.on("projectClose", function(e) {
                activity.details = "Start page";
                activity.state = "Idling";
                activity.startTimestamp = startDate;
                activity.smallImageKey = 'null';
                activity.smallImageText = 'null';
                rpc.setActivity(activity);
            });

            GMEdit.on("fileOpen", function(e) {
                activity.state = e.file.name != "WelcomePage" ? e.file.name : "Idling";
                rpc.setActivity(activity);
            });

            GMEdit.on("activeFileChange", function(e) {
                activity.state =  e.file.name;
                if (e.file.name != "WelcomePage") {
                    activity.state = "file: "+ activity.state;
                }
                rpc.setActivity(activity);
            });
        }
    });
})();