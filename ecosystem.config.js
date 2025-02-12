module.exports = {
  apps: [
    {
      name: "Backend-API", // Nama aplikasi Anda
      script: "./dist/app.js", // Path ke file aplikasi Anda
      watch: false, // Aktifkan watch jika ingin memantau perubahan (set ke true)
      env: {
        NODE_ENV: "development", // Environment untuk pengembangan
      },
      env_production: {
        NODE_ENV: "production", // Environment untuk produksi
      },
    },
  ],

  deploy: {
    production: {
      user: "SSH_USERNAME",
      host: "SSH_HOSTMACHINE",
      ref: "origin/master",
      repo: "GIT_REPOSITORY",
      path: "DESTINATION_PATH",
      "pre-deploy-local": "",
      "post-deploy":
        "npm install && pm2 reload ecosystem.config.js --env production",
      "pre-setup": "",
    },
  },
};
