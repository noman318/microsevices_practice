const ormConfig = {
  type: "mongodb",
  host: "localhost",
  database: "node_main",
  synchronize: true,
  logging: false,
  entities: ["src/entity/*.js"],
} as any;

export default ormConfig;
