import { isPlatformBrowser } from "@angular/common";
import { inject, Injectable, PLATFORM_ID } from "@angular/core";
import * as XLSX from "xlsx";
import { NotificationService } from "./notification.service";

@Injectable({
    providedIn: "root",
})
export class SpreadsheetsService {
    private xlsx = XLSX;

    private platformId = inject(PLATFORM_ID);

    private notificationService = inject(NotificationService);

    exportDataToCSV(data: object[], fileName: string = "data"): void {
        try {
            if (!isPlatformBrowser(this.platformId)) {
                console.error("CSV export is only supported in the browser.");

                return;
            }

            // Convert the data to a 2d array with the first row containing the keys and the following rows containing the values
            const csv2DArray = [Object.keys(data[0])];

            for (const item of data) {
                const values = Object.values(item);

                const sanitizedValues = values.map((value) => {
                    if (typeof value === "string") {
                        return value.replaceAll(",", "|");
                    } else if (value === null || value === undefined) {
                        return "";
                    } else if (typeof value === "object") {
                        return JSON.stringify(value).replaceAll(",", "|");
                    } else {
                        return value.toString();
                    }
                });

                csv2DArray.push(sanitizedValues);
            }

            const csvArray = csv2DArray.map((row) => row.join(","));

            const blob = new Blob([csvArray.join("\n")], { type: "text/csv;charset=utf-8;" });

            const url = URL.createObjectURL(blob);

            const link = document.createElement("a");

            link.href = url;
            link.download = `${fileName}.csv`;
            link.click();
        } catch (error) {
            this.notificationService.error("Fehler", "Die CSV-Datei konnte nicht exportiert werden.");
        }
    }

    exportDataToExcel(data: object[], fileName: string = "data", sheetName: string = "Sheet1"): void {
        try {
            const workSheet = this.xlsx.utils.json_to_sheet(data);

            const workBook = this.xlsx.utils.book_new();

            this.xlsx.utils.book_append_sheet(workBook, workSheet, sheetName);

            this.xlsx.writeFile(workBook, `${fileName}.xlsx`);
        } catch (error) {
            this.notificationService.error("Fehler", "Die Excel-Datei konnte nicht exportiert werden.");
        }
    }

    exportDataToOpenDocumentSpreadsheet(data: object[], fileName: string = "data", sheetName: string = "Sheet1"): void {
        try {
            const workSheet = this.xlsx.utils.json_to_sheet(data);

            const workBook = this.xlsx.utils.book_new();

            this.xlsx.utils.book_append_sheet(workBook, workSheet, sheetName);

            this.xlsx.writeFile(workBook, `${fileName}.ods`);
        } catch (error) {
            this.notificationService.error("Fehler", "Die OpenDocument-Datei konnte nicht exportiert werden.");
        }
    }
}
