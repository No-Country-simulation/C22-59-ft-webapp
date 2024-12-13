import {Express, Request, Response} from "express";
import swaggerJsDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import {SwaggerTheme, SwaggerThemeNameEnum} from "swagger-themes";
import "dotenv/config";

const swaggerUiOptions = {
	explorer: true,
	customCss: new SwaggerTheme().getBuffer(SwaggerThemeNameEnum.ONE_DARK),
};
const options: swaggerJsDoc.Options = {
	definition: {
		openapi: "3.0.0",
		info: {
			title: "Elysium Clinic API",
			version: "1.0.0",
			description: "Backend Service REST API.",
			license: {
				name: "MIT",
				url: "https://github.com/No-Country-simulation/C22-59-ft-webapp/blob/main/LICENSE",
			},
		},
		security: [
			{
				bearerAuth: [],
			},
		],
	},
	apis:
		(process.env.NODE_ENV ?? "local") !== "local"
			? ["dist/routes/user/user.routes.ts"] // Production
			: ["src/routes/**/**.routes.ts"], //["@src/**/*.ts"] Local
};

const swaggerSpec = swaggerJsDoc(options);

const swaggerDocs = async (app: Express) => {
	app.use(
		"/api/docs",
		swaggerUi.serve,
		swaggerUi.setup(swaggerSpec, swaggerUiOptions)
	);
	app.use("/api-docs/swagger.json", (req: Request, res: Response) => {
		res.setHeader("Content-Type", "application/json");
		res.send(swaggerSpec);
	});
};
export default swaggerDocs;
