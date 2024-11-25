import { Express,Request,Response } from "express";
import swaggerJsDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { SwaggerTheme, SwaggerThemeNameEnum }from 'swagger-themes';
import "dotenv/config";



const swaggerUiOptions = {
    explorer: true,
    customCss: (new SwaggerTheme()).getBuffer(SwaggerThemeNameEnum.ONE_DARK),
}
const options: swaggerJsDoc.Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Doctor Appointment API",
      version: "1.0.0",
      description: "API para agendamiento de citas médicas",
      license: {
        name: "MIT",
        url: "https://opensource.org/licenses/MIT",
      },
    },
    components: {
      schemas: {
        Appointment: {
          type: "object",
          properties: {
            doctor: {
              type: "string",
              description: "ID del doctor",
            },
            user: {
              type: "string",
              description: "ID del usuario",
            },
            date: {
              type: "string",
              format: "date-time",
              description: "Fecha y hora de la cita",
            },
            status: {
              type: "string",
              enum: ["scheduled", "completed", "cancelled"],
              description: "Estado de la cita",
            },
            reason: {
              type: "string",
              description: "Motivo de la cita",
            },
            notes: {
              type: "string",
              description: "Notas adicionales",
            },
          },
        },
        Doctor: {
          type: "object",
          properties: {
            name: {
              type: "string",
              description: "Nombre del doctor",
            },
            surname: {
              type: "string",
              description: "Apellido del doctor",
            },
            specialty: {
              type: "string",
              description: "Especialidad del doctor",
            },
            email: {
              type: "string",
              format: "email",
              description: "Correo electrónico del doctor",
            },
            telephone: {
              type: "string",
              description: "Teléfono del doctor",
            },
            licenseNumber: {
              type: "string",
              description: "Número de licencia médica",
            },
          },
        },
        User: {
          type: "object",
          properties: {
            name: {
              type: "string",
              description: "Nombre del usuario",
            },
            surname: {
              type: "string",
              description: "Apellido del usuario",
            },
            email: {
              type: "string",
              format: "email",
              description: "Correo electrónico del usuario",
            },
            telephone: {
              type: "string",
              description: "Teléfono del usuario",
            },
          },
        },
      },
    },
  },
	apis:(process.env.NODE_ENV ?? "local") !== "local"
	? ["./dist/routes/**/*.ts"] // Production
	: ["./src/routes/**/*.ts"], //["./src/**/*.ts"] Local
};

const swaggerSpec = swaggerJsDoc(options);



const swaggerDocs =  async (app: Express) => {
    app.use(
			"/api-docs",
			swaggerUi.serve,
			swaggerUi.setup(swaggerSpec, swaggerUiOptions)
		);
    app.use("/api-docs/swagger.json", (req: Request, res: Response) => {
        res.setHeader("Content-Type", "application/json");
        res.send(swaggerSpec);
    });
};
export default swaggerDocs;
