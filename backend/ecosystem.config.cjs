// Ubicación en el repo: backend/ecosystem.config.cjs
// .cjs porque package.json tiene "type": "module"

module.exports = {
  apps: [
    {
      name: "backend-express-app",  // nombre que verás en `pm2 list`
      script: "dist/index.js",      // ajusta al punto de entrada que genera tsc
      cwd: __dirname,
      node_args: "--env-file=.env", // carga el .env (Node 20.6+); si usas dotenv también funciona
      exec_mode: "fork",
      instances: 1,
      autorestart: true,
      max_memory_restart: "300M",
      env_production: {
        NODE_ENV: "production",
      },
    },
  ],
};
