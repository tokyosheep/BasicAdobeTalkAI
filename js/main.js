window.onload = () =>{
    "use strict";
    const csInterface = new CSInterface();
    themeManager.init();

    const http = require("http");
    const url = require("url");
    const PSURL = "http://localhost:8000/";
    
    const toPS = document.getElementById("toPS");
    const extensionRoot = csInterface.getSystemPath(SystemPath.EXTENSION) +`/jsx/`;
    csInterface.evalScript(`$.evalFile("${extensionRoot}json2.js")`);//json2読み込み

    const obj = {
        "greed":"how's it going?",
        "owner":"fromAI"
    }

    const server = http.createServer((request,response)=>{
        const url_parts = url.parse(request.url);
        switch(url_parts.pathname){
            case "/":
                if(request.method == "GET"){
                    response.writeHead(200,{"Content-Type":"text/plain"});
                    response.write("Illustrator server is running");
                    response.end();
                }else if(request.method == "POST"){
                    let body = "";
                    request.on("data",chunk=>{
                        body += chunk;
                    });
                    request.on("end",anwser=>{
                        anwser = JSON.parse(body);
                        callFromJsx(anwser);
                        response.end();
                    });
                }else{
                    alert("error");
                }

            default:
                response.writeHead(200,{"COntent-Type":"text/plain"});
                response.end("no page....");
                break;    
        }
    });

    server.listen(3000);

    function callFromJsx(obj){
        csInterface.evalScript(`sayHello(${JSON.stringify(obj)})`);
    }

    toPS.addEventListener("click",()=>{
        fetch(PSURL,{
            method:"POST",
            body:JSON.stringify(obj),
            headers:{"Content-type":"application/json"}
        })
        .then(res => console.log(res))
        .catch(error => alert(error));
    });
}
