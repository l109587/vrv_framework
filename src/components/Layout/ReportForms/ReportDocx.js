import { saveAs } from "file-saver";
import htmlDocx from "html-docx-js/dist/html-docx";
import html2canvas from "html2canvas";
import { message } from "antd";

const reportDocx = (name) => {
  const app = document.querySelector("#exportBox");
  const cloneApp = app.cloneNode(true);

  const canvases = app.querySelectorAll("canvas,#clone");
  const cloneCanvases = cloneApp.querySelectorAll(
    "canvas,#clone"
  );

  //canvas、dom转图片
  const promises = Array.from(canvases).map((dom, index) => {
    return new Promise((res) => {
      if (dom.nodeName !== "CANVAS") {
        //将dom元素转为图片
        html2canvas(dom)
          .then(function (canvas) {
            const url = canvas.toDataURL('image/webp',1);

            const img = new Image();
            img.onload = () => {
              res();
            };
            img.src = url;
            img.style.marginBottom = '20px'
            // 生成img替换clone的dom
            cloneCanvases[index].parentNode.replaceChild(
              img,
              cloneCanvases[index]
            );
          })
          .catch((error) => {
            console.log(error);
          });
      } else {
        const url = dom.toDataURL('image/webp', 1);
        const img = new Image();
        img.onload = () => {
          // URL.revokeObjectURL(url)
          res();
        };
        img.src = url;
        // 生成img替换clone的dom
        cloneCanvases[index].parentNode.replaceChild(img, cloneCanvases[index]);
      }
    });
  });

  //移除原来的canvas
  const cloneCanvas = cloneApp.querySelectorAll("#clone");
  console.log(cloneCanvas,'cloneCanvas');
  Array.from(cloneCanvas).forEach((ca) => ca.style.marginBottom='20px');

  //dom转图片

  Promise.all(promises).then(() => {
    convertImagesToBase64(cloneApp);
    const converted = htmlDocx.asBlob(
      `<html xmlns:o=\'urn:schemas-microsoft-com:office:office\' xmlns:w=\'urn:schemas-microsoft-com:office:word\' xmlns=\'http://www.w3.org/TR/REC-html40\'><head>
                  </head>
                  <body>
                  ${cloneApp.outerHTML}
                   </body>
                  </html>`,
      { margins: { left: 1020, right: 1020, top: 1020, bottom: 1020 } }
    );
    const savePromise = new Promise((resolve, reject)=>{
      saveAs(converted, `${name}.docx`)
      resolve()
    })
    savePromise.then(()=>{
      document.body.removeChild(document.getElementById("loading"));
      message.success('导出成功')
    })
  });
};

const convertImagesToBase64 = (cloneApp) => {
  var regularImages = cloneApp.getElementsByTagName("img");
  var canvas = document.createElement("canvas");
  var ctx = canvas.getContext("2d");
  regularImages.forEach((item) => {
    canvas.width = item.width;
    canvas.height = item.height;
    ctx.drawImage(item, 0, 0, item.width, item.height);
    var ext = item.src.substring(item.src.lastIndexOf(".") + 1).toLowerCase();
    var dataURL = canvas.toDataURL("image/" + ext);
    item.setAttribute("src", dataURL);
  });
  canvas.remove();
};
export default reportDocx;
