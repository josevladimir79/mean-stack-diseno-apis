module.exports = {
  apps : [{
    script: 'index.js',
    watch: '.',
    instances: "max",
    exec_mode: "cluster",
    env: {
        ENV: "dev",
        PORT: 3000,
        JWT_SECRET: "secRETpRODUccionAWS2o26------",
	MONGODB_URI: "mongodb+srv://josevladimirvp_db_user:DY8jsDwf43xM1Dki@cluster0.jnbqr4y.mongodb.net"
    },
    error_file: "/var/www/tu-app/logs/err.log",
    out_file: "/var/www/tu-app/logs/out.log",
    log_date_format: "YYYY-MM-DD HH:mm:ss Z",
    merge_logs: true
  }, {
    script: './service-worker/',
    watch: ['./service-worker']
  }],

  deploy : {
    production : {
      user : 'ubuntu',
      host : '54.243.96.8',
      ref  : 'origin/main',
      repo : 'git@github.com:josevladimir79/mean-stack-diseno-apis.git',
      path : 'var/www/backend',
      'post-deploy' : 'mkdir -p logs && npm install && pm2 reload ecosystem.config.js --env production',
      ssh_options: "IdentityFile=~/.ssh/bkeys.pem" 
    }
  }
};
