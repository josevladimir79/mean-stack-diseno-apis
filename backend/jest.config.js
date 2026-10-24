const config = {
    preset: "ts-jest",
    testEnvironment: "node",
    verbose: true,
    clearMocks: true,
    testMatch: ["**/?(*.)+(spec|test).ts"],
    transform: {
        "^.+\\.tsx?$": ["ts-jest", { tsconfig: "tsconfig.jest.json" }],
    },
    moduleNameMapper: {
        "^(\\.{1,2}/.*)\\.js$": "$1",
    },
};
export default config;
//# sourceMappingURL=jest.config.js.map