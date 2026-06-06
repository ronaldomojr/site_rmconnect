import puppeteer from "puppeteer-core";
const CHROME = "C:/Program Files/Google/Chrome/Application/chrome.exe";
const browser = await puppeteer.launch({ executablePath: CHROME, headless:"new",
  args:["--no-sandbox","--use-gl=angle","--use-angle=swiftshader","--enable-unsafe-swiftshader","--ignore-gpu-blocklist"],
  defaultViewport:{width:1440,height:900} });
const page = await browser.newPage();
await page.emulateMediaFeatures([{ name:"prefers-reduced-motion", value:"reduce" }]);
await page.goto("http://localhost:3000",{waitUntil:"networkidle2",timeout:60000});
await new Promise(r=>setTimeout(r,3000));
const prog=()=>page.evaluate(()=>window.__prog);
// aproxima MUITO devagar até 3100 e vai assentando, capturando quando val cruza ~3
let shot=false;
for (let s=200; s<=3300; s+=40){
  await page.evaluate(v=>scrollTo(0,v),s);
  await new Promise(r=>setTimeout(r,110));
  if (s%400===0){ const p=await prog(); if(p!==undefined) {/*progress*/} }
  const p=await prog();
  if(!shot && p!==undefined && p>=2.97 && p<=3.05){
    await new Promise(r=>setTimeout(r,1200));
    const p2=await prog();
    if(p2>=2.9 && p2<=3.12){ await page.screenshot({path:"z3-brain.png"}); console.log("captured val="+p2.toFixed(2)+" @y="+s); shot=true; break; }
  }
}
if(!shot) console.log("nao capturou");
await browser.close();
