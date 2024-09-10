import { exec } from 'child_process';
import { promisify } from 'util';

type Props = {
  phone: string;
  content: string;
};

type Response = {
  result: string;
};

// // 使用 util.promisify 将 exec 转换为返回 Promise 的函数
// const execPromise = promisify(exec);
function execPromise(command: string): Promise<{ stdout: string; stderr: string }> {
  return new Promise((resolve, reject) => {
    exec(command, (error, stdout, stderr) => {
      if (error) {
        reject(stderr || error.message);
      } else {
        resolve({ stdout, stderr });
      }
    });
  });
}

const main = async ({ phone, content }: Props): Promise<Response> => {
  try {
    // 将 Python 脚本的参数传递给 exec（假设 script.py 需要这些参数）
    // 注意：这里假设 script.py 能够处理从命令行接收的参数
    const command = `python ../../python/api/services/sendSMS/script.py "${phone}" "${content}"`;
    const { stdout, stderr } = await execPromise(command);

    if (stderr) {
      // 解析 stderr 中的 JSON（如果 Python 脚本以 JSON 格式输出错误）
      try {
        const errorInfo = JSON.parse(stderr);
        return { result: `Error1: ${errorInfo.message || stderr}` };
      } catch (parseError) {
        // 如果不是 JSON，直接返回 stderr
        return { result: `Error3: ${stderr}` };
      }
    }

    // 尝试解析 stdout 中的 JSON（如果 Python 脚本以 JSON 格式返回成功信息）
    try {
      const successInfo = JSON.parse(stdout);
      return { result: successInfo.message || 'Sent successfully' };
    } catch (parseError) {
      // 如果不是 JSON，返回默认成功消息
      return { result: 'Sent successfully' };
    }
  } catch (error) {
    // 捕获 execPromise 抛出的任何错误
    return { result: 'Error2: ' + error };
  }
};

export default main;
