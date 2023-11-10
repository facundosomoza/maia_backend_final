const MODE = "prod"; //dev, prod

const config = {
  dev: {
    db: {
      HOST: "localhost",
      USER: "root",
      PASSWORD: "",
      DATABASE: "maia_art",
    },
    mode: "dev",
  },
  prod: {
    db: {
      HOST: "149.50.130.125",
      USER: "maia_remote",
      PASSWORD: "CgrtGHQM5y5y",
      DATABASE: "maia_art",
    },
    mode: "prod",
  },
};

const getConfig = () => {
  return config[MODE];
};

module.exports = { getConfig };
