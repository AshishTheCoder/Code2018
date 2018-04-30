Meteor.methods({
  uploadMasterSheetExcel(filepath, fileHref, month){
    console.log(filepath);
    console.log(fileHref);
    console.log(month);

    var fs = Npm.require('fs');
    var excel = new Excel('xlsx');
    var workbook = excel.readFile(filepath);
    var yourSheetsName = workbook.SheetNames;
    // var revision = workbook.Sheets[yourSheetsName[0]]['B' + [9]].v;
    // var toDate = workbook.Sheets[yourSheetsName[0]]['B' + [8]].v;

    return returnSuccess('Submitted');
  }
});
