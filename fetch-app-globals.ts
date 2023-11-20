import * as path from 'path';
import Excel from 'exceljs';
import express from 'express';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename)

const app: express.Application = express();

type Configurations = {
    phoneNumber: string;
    emailAddress: string;
    title: string;
    footer: string;
}

const filePath = path.resolve(__dirname, './app-globals/app_configs.xlsx');

const getCellValue = (row: Excel.Row, cellIndex: number) => {
    const cell = row.getCell(cellIndex);

    return cell.value ? cell.value.toString() : '';
};

const getEmailTypeCellValue = (row: Excel.Row, cellIndex: number) => {
    const cell: any = row.getCell(cellIndex);

    return cell.value.text ? cell.value.text.toString() : '';
};

const main = async () => {
    const workbook = new Excel.Workbook();
    const content = await workbook.xlsx.readFile(filePath);

    const worksheet = content.worksheets[0];

    const phoneNumber = getCellValue(worksheet.getRow(1), 2);
    const emailAddress = getEmailTypeCellValue(worksheet.getRow(2), 2);
    const title = getCellValue(worksheet.getRow(3), 2);
    const footer = getCellValue(worksheet.getRow(4), 2);
    const configurations: Configurations = {
        // @ts-ignore
        phoneNumber,
        // @ts-ignore
        emailAddress,
        // @ts-ignore
        title,
        footer,
    };
    return configurations;
};

const authConfigs = {
    //production: true,
    whiteListDomains: ['localhost:4445', 'localhost:4440'],
    apiUrl: '/api',
    apiProxy: 'https://localhost:4440',
    authUrl: 'https://localhost:4445',
    authClient: 'jaidka.services.client.web',
    authSecret: 'jaidka.services.web.stage.clientsecret'
};

main().then((configs) => {
    app.use('/assets/config.js', (req, res, next) => {
        res.set('Content-Type', 'application/javascript');
        res.send(`window.config = ${configs};`);
        res.end();
    });

    app.use('/assets/authConfig.js', (req, res, next) => {
        res.set('Content-Type', 'application/javascript');
        res.send(`window.authConfig' = ${authConfigs};`);
        res.end();
    });
});