import domtoimage from "dom-to-image";
import html2canvas from "html2canvas";

export default class ScreenshotUtil {
  public static getPngScreenshot(
    className: string,
    imgStyle: object = {
      bgcolor: "#fff",
      quality: 0.8
    }
  ): Promise<string> {
    const node = document.querySelector(className) as HTMLElement;
    if (node) {
      return new Promise((resolve, reject) => {
        domtoimage
          .toPng(node, imgStyle)
          .then(result => {
            resolve(result);
          })
          .catch(err => {
            reject(err);
          });
      });
    } else {
      return Promise.reject();
    }
  }

  public static getPngListScreenshot(
    className: string,
    imgStyle: object = {
      bgcolor: "#fff",
      quality: 0.8
    }
  ): Promise<
    Array<{
      dashboardId: string;
      fullPath: string;
      title: string;
    }>
  > {
    const nodeList = document.querySelectorAll(className);
    if (nodeList.length) {
      const promiseList = Array.prototype.map.call(nodeList, node => {
        return new Promise((resolve, reject) => {
          domtoimage
            .toPng(node, imgStyle)
            .then(result => {
              resolve({
                dashboardId: node.id,
                fullPath: result,
                title: node.getAttribute("data-title")
              });
            })
            .catch(err => {
              reject(err);
            });
        });
      });
      return Promise.all(promiseList).then(result => {
        return Promise.resolve(result);
      }) as Promise<
        Array<{
          dashboardId: string;
          fullPath: string;
          title: string;
        }>
      >;
    } else {
      return Promise.reject([]);
    }
  }

  public static getHtmlScreenhot(className: string): Promise<string> {
    const targetDom = document.querySelector(className) as HTMLElement;
    if (targetDom) {
      return new Promise((resolve, reject) => {
        // const copyDom = targetDom.cloneNode(true) as HTMLElement;
        // copyDom.classList.remove("grid-box");
        // targetDom.style.width = targetDom.scrollWidth + "px";
        // targetDom.style.height = targetDom.scrollHeight + "px";
        // document.body.appendChild(copyDom);
        html2canvas(targetDom, {
          allowTaint: false,
          useCORS: true,
          height: targetDom.scrollHeight,
          width: targetDom.scrollWidth
        })
          .then((canvas: HTMLCanvasElement) => {
            resolve(canvas.toDataURL("image/png"));
          })
          .catch(err => {
            reject(err);
          });
      });
    } else {
      return Promise.reject();
    }
  }

  public static getHtmlListScreenhot(
    className: string
  ): Promise<
    Array<{
      dashboardId: string;
      fullPath: string;
      title: string;
    }>
  > {
    const targetDomList = document.querySelectorAll(className) as NodeList;
    if (targetDomList.length) {
      const promiseList = Array.prototype.map.call(targetDomList, targetDom => {
        return new Promise((resolve, reject) => {
          html2canvas(targetDom, {
            allowTaint: false,
            useCORS: true,
            height: targetDom.scrollHeight,
            width: targetDom.scrollWidth
          })
            .then((canvas: HTMLCanvasElement) => {
              const result = {
                dashboardId: targetDom.id,
                title: targetDom.getAttribute("data-title"),
                fullPath: canvas.toDataURL("image/png")
              };
              resolve(result);
            })
            .catch(err => {
              reject(err);
            });
        });
      });
      return Promise.all(promiseList).then(result => {
        return Promise.resolve(result);
      }) as Promise<
        Array<{
          dashboardId: string;
          fullPath: string;
          title: string;
        }>
      >;
    } else {
      return Promise.resolve([]);
    }
  }
}
