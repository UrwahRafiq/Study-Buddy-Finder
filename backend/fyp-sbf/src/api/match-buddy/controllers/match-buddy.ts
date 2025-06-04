import { spawn } from 'child_process';
import path from 'path';
import { factories } from '@strapi/strapi';

export default factories.createCoreController('api::match-buddy.match-buddy', ({ strapi }) => ({
  async find(ctx) {
    const userId = ctx.state.user.id;

    const currentUser = await strapi.entityService.findOne('plugin::users-permissions.user', userId, {
      fields: ['email', 'username', 'courses', 'degree', 'interests', 'university'],
    });

    const allUsers = await strapi.entityService.findMany('plugin::users-permissions.user', {
      fields: ['email', 'username', 'courses', 'degree', 'interests', 'university'],
    });

    const input = JSON.stringify({
      current_user: currentUser,
      all_users: allUsers.filter(u => u.id !== userId),
    });

    // ✅ Define both python path and script path using absolute path
    const pythonPath = 'C:\\Users\\92331\\Desktop\\FYP-SBF\\backend\\fyp-sbf\\python\\.venv\\Scripts\\python.exe';  // Absolute path to python.exe
    const scriptPath = path.join(process.cwd(), 'python', 'match_users.py');  // Path to your Python script

    const py = spawn(pythonPath, [scriptPath]);

    return new Promise((resolve, reject) => {
      let output = '';
      let error = '';

      py.stdin.write(input);
      py.stdin.end();

      py.stdout.on('data', (data) => {
        output += data.toString();
      });

      py.stderr.on('data', (data) => {
        error += data.toString();
      });

      py.on('close', (code) => {

        if (code !== 0) {
          console.error("Non-zero exit code from Python script:", code);
          return reject(ctx.internalServerError("Python script execution failed"));
        }

        if (error) {
          console.error("Python error output:", error);
          return reject(ctx.internalServerError("Python script error: " + error));
        }

        try {
          const matches = JSON.parse(output);
          resolve({ data: { matches } });
        } catch (e) {
          console.error("Parse error:", e);
          reject(ctx.internalServerError("Invalid match result"));
        }
      });
    });
  }
}));