/**
 * 超时 Promise
 *
 * @param promise Promise 对象
 * @param timeout 超时时间
 */
export function promiseTimeout(
  promise: Promise<any>,
  timeout: number
): Promise<any> {
  const timeoutPromise = new Promise((reslove, reject) => {
    setTimeout(() => {
      reject(new Error("Promise timeout"));
    }, timeout);
  });

  return Promise.race([timeoutPromise, promise]);
}
