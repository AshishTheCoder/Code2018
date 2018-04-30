Meteor.methods({
    'setDiscomScheme': function() {
        var discomNameVar = [];
        var data = Schemes.find().fetch();
        data.forEach(function(item) {
            discomNameVar.push({
                discomSchemeId: item._id,
                discomScheme: item.scheme
            });
        });
        var ar = discomNameVar.sort(function(a, b) {
            var nA = a.discomScheme.toLowerCase();
            var nB = b.discomScheme.toLowerCase();
            if (nA < nB)
                return -1;
            else if (nA > nB)
                return 1;
            return 0;
        });
        return returnSuccess('Discom List Arrar', ar);
    },

    'setDiscom': function(discomScheme) {
        var discomNameVar = [];
        var data = Discom.find({
            "scheme": {
                $in: discomScheme
            }
        }).fetch();
        data.forEach(function(item) {
            discomNameVar.push({
                discomId: item._id,
                state: item.discom_state
            });
        });
        var ar = discomNameVar.sort(function(a, b) {
            var nA = a.state.toLowerCase();
            var nB = b.state.toLowerCase();
            if (nA < nB)
                return -1;
            else if (nA > nB)
                return 1;
            return 0;
        });
        return returnSuccess('Discom List Arrar', ar);
    },
    // GeneratePDFForUplinkFromFOREX() {
    //   var fs = require('fs');
    //   var Docxtemplater = require('docxtemplater');
    //   var filepath = Assets.absoluteFilePath('_SLDC.docx');
    //   var content = fs.readFileSync(filepath, "binary");
    //   var doc = new Docxtemplater(content);
    //   var get_id="1234";
    //   var filepath= process.env.PWD + '/.uploads/transcoSheet';
    //   console.log(filepath);
    //   doc.setData({
    //     'SECI': "SECI/Power Trading/Credit Note/2016-17/12293",
    //     'date': "31.03.2017",
    //     'SLDC': "SLDC",
    //     'Operation': "Operation",
    //     'Charges': "Charges",
    //     '100C': "100C with reference to (SECI/Assam/RAJASTHAN/SLDC Operation Charges/April-December 2016)",
    //     'amount': "96,012.00",
    //     'words': "Rupees Ninety Six Thousand and Twelve only",
    //     'number_invoice': "SECI/Assam/Rajasthan/SLDC Charges/2017/Apr-jun/1",
    //     'invoice_date': "06 April 2017",
    //     'to': "01-04-2017",
    //     'from': "30-06-2017",
    //     'SLDC': "SLDC OPeration Charges",
    //     'capacity': "20000",
    //     'rate': "0.5966",
    //     'period': "April'2017",
    //     'amount1': "11932.00",
    //     'amount_in_words': "Rupees Thirty Five Thousand Seven Hundred Ninety Six only",
    //     'Grand_total': "35796.00",
    //     'May': "06 May 2017",
    //   });
    //   doc.render();
    //   var buffer = doc.getZip().generate({
    //     type: "nodebuffer"
    //   });
    //
    //   fs.writeFileSync(filepath + get_id + '_SLDC.docx', buffer);
    //   spawn = Npm.require('child_process').spawn;
    //
    // if (/^win/.test(process.platform)) {
    //     command = spawn('C:\\Program Files\\LibreOffice 5\\program\\soffice.exe', ['/s', '/c', '--headless', '--convert-to', 'pdf', filepath + get_id + '_SLDC.docx', '--outdir', filepath]);
    //   } else {
    //     command = spawn('libreoffice', ['--headless', '--convert-to', 'pdf', filepath + get_id + '_SLDC.docx', '--outdir', filepath]);
    //   }
    //   command.stdout.on('data', function(data) {
    //     console.log('stdout: ' + data);
    //   });
    //   command.stderr.on('data', function(data) {
    //     console.log('stderr: ' + data);
    //   });
    //   command.on('exit', function(code) {
    //     console.log('child process exited with code ' + code);
    //   });
    //   // console.log('pathIs ' + pathIs);
    // },


    'generateTranscoSheet': function(json) {
      if(json.stu_transaction_type=='SOC' || json.stu_transaction_type=='MOC'){
          var stateAry=['MP','Gujarat'];
          // var monthAry = json.month.split(',');
          // var transcoData='';
          var data = [];
          // monthAry.forEach(function(item) {
          //    transcoData = TranscoSheetSocMoc.find({"month":json.month, "financial_year": json.financial_year, stu_transaction_type:json.stu_transaction_type,stu_ctu:json.ddlStuCtuType}).fetch();
          //      console.log(transcoData);
          //   transcoData.forEach(function(transcoItem) {
          //     data.push(transcoItem);
          //   });
          // });
          stateAry.forEach(function(item) {
             var transcoData = TranscoSheetSocMoc.find({"month":json.month, "financial_year": json.financial_year, stu_transaction_type:json.stu_transaction_type,stu_ctu:json.ddlStuCtuType,"soc_moc_state":item}).fetch();
            transcoData.forEach(function(transcoItem) {
              data.push(transcoItem);
            });
          });
          // data=TranscoSheetSocMoc.find({"month":json.month, "financial_year": json.financial_year, stu_transaction_type:json.stu_transaction_type,stu_ctu:json.ddlStuCtuType}).fetch();
      if(data.length==0){
      return returnFaliure('Data Not Found');
    }else if(data.length==1 && data[0].soc_moc_state=='Gujarat'){
      return returnFaliure('Data Not Found for MP');
    }else if(data.length==1 && data[0].soc_moc_state=='MP'){
      return returnFaliure('Data Not Found for Gujarat');
    }
    var excelbuilder = require('msexcel-builder');
    var random = Math.floor((Math.random() * 10000) + 1).toString();
    var excelName = "TranscoSheet_CTU" + json.month + "_" + json.financial_year + "_" + random;
    var filePath = '/upload/transcoSheet/' + excelName + '.xlsx';
    var filePathForDelete = '/.uploads/transcoSheet/' + excelName + '.xlsx';
    var workbook = excelbuilder.createWorkbook(process.env.PWD + '/.uploads/transcoSheet/', excelName + '.xlsx');
    var n = data.length;
    var borderLength = n + 2;
     if (n == 2) {
        var sheet1 = workbook.createSheet('sheet1', 16, 10);
        var dataRow = ["", "Sl. No.", "Month", "Total Capacity(MW)", "CTU Invoice No.", "Invoice Date of CTU", "Due Date of CTU", "Amount raised by CTU", "Amount Paid to CTU", "Remarks", "SPD Name", "State", "Capacity MW","SOC/MOC Charges","Project wise SOC/MOC Charges(Rs.)","CTU"];
        var dataRowWidth = [0, 10, 15, 25, 20, 25, 20, 25, 25, 15, 55, 20, 15, 20, 50, 20];
        var lengthData = dataRow.length;
        sheet1.height(1, 50);
        for (var i = 1; i < lengthData; i++) {
            sheet1.set(i, 1, dataRow[i]);
            sheet1.font(i, 1, {
                sz: '11',
                bold: 'true'
            });
            sheet1.width(i, dataRowWidth[i]);
            sheet1.align(i, 1, 'center');
            sheet1.valign(i, 1, 'center');
        }
        for (var i = 1; i < 10; i++) {
        sheet1.merge({col:i,row:2},{col:i,row:6});
        sheet1.merge({col:i,row:7},{col:i,row:10});
      }
        var j = 2;
        var s=2;
        for (var r = 0; r < 2; r++) {
            var c = 0;
          //   if(r<=6){
          //   sheet1.merge({col:j-1,row:2},{col:j-1,row:6});
          // }else{
          // sheet1.merge({col:j-1,row:7},{col:j-1,row:6});
          // }
            sheet1.set(c + 1, s, j-1);
            sheet1.set(c + 2, s, data[j - 2].month);
            // sheet1.set(c + 3, s, "120");//Capacity
            sheet1.set(c + 4, s, data[j - 2].invoiceNumber);
            sheet1.set(c + 5, s, data[j - 2].stu_invoiceDate);
            sheet1.set(c + 6, s, data[j - 2].stu_dueDate);
            sheet1.set(c + 7, s, data[j - 2].stu_amountRaised);
            sheet1.set(c + 8, s, "0");//Amount Paid to STU
            sheet1.set(c + 9, s, data[j - 2].stu_remarks);
            // sheet1.set(15, j, data[j - 2].stu_remarks);
            // sheet1.set(c + 9, j, data[j - 2].stu_remarks);
            // sheet1.set(c + 10, j, "0");//Ref. SPD
            // sheet1.set(c + 11, j, data[j - 2].invoice_number);
            // sheet1.set(c + 12, j, data[j - 2].generation_date);
            // sheet1.set(c + 13, j, data[j - 2].due_date);
            // sheet1.set(c + 14, j, data[j - 2].invoice_amount);
            // sheet1.set(c + 15, j, data[j - 2].date_of_payment);
            // sheet1.set(c + 16, j, data[j - 2].payment_amount);
            // sheet1.set(c + 17, j, data[j - 2].short_payment_amount);
            // sheet1.set(c + 18, j, "");// Remarks 2nd
            // sheet1.set(c + 19, j, data[j - 2].discom_shortName);//Buying Utility
            // sheet1.set(c + 20, j, data[j - 2].stu_ctu);
            j++;
            var s=s+5;
        }
            sheet1.set(3, 2, "120");//Capacity
           sheet1.set(3, 7, "40");//Capacity
         sheet1.set(10, 2, "IL&FS Energy Development Company Limited(1MP)");
          sheet1.set(10, 3, "IL&FS Energy Development Company Limited(2MP)");
          sheet1.set(10, 4, "Waneep Solar Pvt. Ltd.");
          sheet1.set(10, 5, "Focal Energy Solar One India Pvt. Ltd.");
          sheet1.set(10, 6, "Focal Renewable Energy Two India Pvt. Ltd.");
          sheet1.set(10, 7, "GSECL");
          sheet1.set(10, 8, "GPCL");
          sheet1.set(10, 9, "ENERSON");
          sheet1.set(10, 10, "BACKBONE");

          for(var q=2;q<7;q++){
            sheet1.set(11, q, "MP");
          }
          for(var q=7;q<11;q++){
            sheet1.set(11, q, "Gujarat");
            sheet1.set(12, q, "10");
          }
            sheet1.set(12, 2, "20");
            sheet1.set(12, 3, "20");
            sheet1.set(12, 4, "50");
            sheet1.set(12, 5, "20");
            sheet1.set(12, 6, "10");
            for(var q=2;q<11;q++){
            sheet1.set(13, q, "30579");
            sheet1.set(15, q, data[0].stu_ctu);
          }
        var k = 2;
        for (var r = 0; r < 11; r++) {
            for (var c = 1; c < lengthData; c++) {
                sheet1.align(c, k, 'center');
                // sheet1.align(c, 7, 'center');
            }
            k++;
        }
        // border
        for (var i = 1; i < 11; i++) {
            for (var s = 1; s < lengthData; s++) {
                sheet1.border(s, i, {
                    left: 'thin',
                    top: 'thin',
                    right: 'thin',
                    bottom: 'thin'
                });
                sheet1.valign(s, i, 'center');
                if (i > 3 && i < 47) {
                    // sheet1.set(1, i , Number(i) - 3);
                    sheet1.align(1, i, 'center');
                    // sheet1.height(i, 23);
                }
            }
        }
        workbook.save(function(ok) {
            console.log('workbook saved ' + (ok ? 'ok' : 'MP Revision Report'));
        });

        Meteor.setTimeout(function() {
            Meteor.call('deleteUploadedFile', process.env.PWD+ filePathForDelete);
        }, 10000);

        return returnSuccess('Excel Created for:', filePath);
    }
    return returnFaliure('Data is not found!');
      }else if(json.stu_transaction_type=='Transmission'){
            // var monthAry = json.month.split(',');
            // var data = [];
            // monthAry.forEach(function(item) {
            //   var transcoData = TranscoSheetTransmission.find({"month":item, "financial_year": json.financial_year, stu_transaction_type:json.stu_transaction_type,stu_ctu:json.ddlStuCtuType}).fetch();
            //   transcoData.forEach(function(transcoItem) {
            //     data.push(transcoItem);
            //   });
            // });
            var data = TranscoSheetTransmission.find({"month":json.month, "financial_year": json.financial_year, stu_transaction_type:json.stu_transaction_type,stu_ctu:json.ddlStuCtuType}).fetch();
        if(data.length==0){
        return returnFaliure('Data Not Found');
      }
        }else if(json.stu_transaction_type=='Incentive'){
          // var monthAry = json.month.split(',');
          // var data = [];
          // monthAry.forEach(function(item) {
          //   var transcoData = TranscoSheetIncentive.find({"month":item, "financial_year": json.financial_year, stu_transaction_type:json.stu_transaction_type,stu_ctu:json.ddlStuCtuType}).fetch();
          //   transcoData.forEach(function(transcoItem) {
          //     data.push(transcoItem);
          //   });
          // });
          var data = TranscoSheetIncentive.find({"month":json.month, "financial_year": json.financial_year, stu_transaction_type:json.stu_transaction_type,stu_ctu:json.ddlStuCtuType}).fetch();
          if(data.length==0){
          return returnFaliure('Data Not Found');
        }
        }else if(json.stu_transaction_type=='SLDC'){
          // var monthAry = json.month.split(',');
          // var data = [];
          // monthAry.forEach(function(item) {
          //   var transcoData = TranscoSheetSldc.find({"month":item, "financial_year": json.financial_year, stu_transaction_type:json.stu_transaction_type,stu_ctu:json.ddlStuCtuType}).fetch();
          //   transcoData.forEach(function(transcoItem) {
          //     data.push(transcoItem);
          //   });
          // });
          var data = TranscoSheetSldc.find({"month":json.month, "financial_year": json.financial_year, stu_transaction_type:json.stu_transaction_type,stu_ctu:json.ddlStuCtuType}).fetch();
          if(data.length==0){
          return returnFaliure('Data Not Found');
        }
      }

      var excelbuilder = require('msexcel-builder');
      var random = Math.floor((Math.random() * 10000) + 1).toString();
      var excelName = "TranscoSheet_STU" + json.month + "_" + json.financial_year + "_" + random;
      var filePath = '/upload/transcoSheet/' + excelName + '.xlsx';
      var filePathForDelete = '/.uploads/transcoSheet/' + excelName + '.xlsx';
      var workbook = excelbuilder.createWorkbook(process.env.PWD + '/.uploads/transcoSheet/', excelName + '.xlsx');
      var n = data.length;
      var borderLength = n + 2;
       if (n > 0) {
          var sheet1 = workbook.createSheet('sheet1', 10, 10);
          var dataRow = ["", "Sl. No.", "Month", "Capacity(MW)", "STU Invoice No.", "Invoice Date of STU", "Due Date of STU", "Amount raised by STU", "Amount Paid to STU", "Remarks"];
          var dataRowWidth = [0, 10, 15, 25, 25, 30, 30, 30, 30, 15];
          var lengthData = dataRow.length;
          sheet1.height(1, 50);
          for (var i = 1; i < lengthData; i++) {
              sheet1.set(i, 1, dataRow[i]);
              sheet1.font(i, 1, {
                  sz: '11',
                  bold: 'true'
              });
              sheet1.width(i, dataRowWidth[i]);
              sheet1.align(i, 1, 'center');
              sheet1.valign(i, 1, 'center');
          }
          // var j = 2;
          // var st="";
          // var str="";
          // var str1="";
          // var str2="";
          // var str3="";
              if(json.stu_transaction_type=='Transmission' && json.ddlStuCtuType=='GETCO'){
                for (var i = 1; i < 4; i++) {
                sheet1.merge({col:i,row:2},{col:i,row:5});
              }
              sheet1.merge({col:8,row:2},{col:8,row:5});
              sheet1.merge({col:9,row:2},{col:9,row:5});
              sheet1.set(1, 2, "1");
              sheet1.set(2, 2, data[0].month);
              sheet1.set(3, 2, "20");
                var v=2;
              for(var k=0;k<4;k++){
              sheet1.set(4, v, data[0].invoiceNumber[k]);
               sheet1.set(5, v, data[0].invoiceDate[k]);
               sheet1.set(6, v, data[0].dueDate[k]);
               sheet1.set(7, v, data[0].invoiceAmount[k]);
              v++;
              }
              sheet1.set(8, 2, "0");
              sheet1.set(9, 2, "remarks");
              for (var i = 1; i < 6; i++) {
                  for (var s = 1; s < lengthData; s++) {
                      sheet1.border(s, i, {
                          left: 'thin',
                          top: 'thin',
                          right: 'thin',
                          bottom: 'thin'
                      });
                      sheet1.valign(s, i, 'center');
                      if (i > 3 && i < 47) {
                          // sheet1.set(1, i , Number(i) - 3);
                          sheet1.align(1, i, 'center');
                          // sheet1.height(i, 23);
                      }
                  }
              }
              // sheet1.set(c + 2, j, data[j - 2].month);

          //   for (var r = 0; r < n; r++) {
          //     var c = 0;
          //     sheet1.set(c + 1, j, j - 1);
          //     sheet1.set(c + 2, j, data[j - 2].month);
          //     sheet1.set(c + 3, j, "");//Capacity
          //     for(var k=0; k<4; k++){
          //      str=str+data[j - 2].invoiceNumber[k]+" ,";
          //      str1=str1+data[j - 2].invoiceDate[k]+" ,";
          //      str2=str2+data[j - 2].dueDate[k]+" ,";
          //      str3=str3+data[j - 2].invoiceAmount[k]+" ,";
          //     sheet1.set(c + 4, j, str);
          //     sheet1.set(c + 5, j, str1);
          //     sheet1.set(c + 6, j, str2);
          //     sheet1.set(c + 7, j, str3);
          //   }
          //     sheet1.set(c + 8, j, "0");//Amount Paid to STU
          //     sheet1.set(c + 9, j, "jjjjjjj");
          //     // sheet1.set(c + 10, j, "0");//Ref. SPD
          //     // sheet1.set(c + 11, j, data[j - 2].invoice_number);
          //     // sheet1.set(c + 12, j, data[j - 2].generation_date);
          //     // sheet1.set(c + 13, j, data[j - 2].due_date);
          //     // sheet1.set(c + 14, j, data[j - 2].invoice_amount);
          //     // sheet1.set(c + 15, j, data[j - 2].date_of_payment);
          //     // sheet1.set(c + 16, j, data[j - 2].payment_amount);
          //     // sheet1.set(c + 17, j, data[j - 2].short_payment_amount);
          //     // sheet1.set(c + 18, j, "");// Remarks 2nd
          //     // sheet1.set(c + 19, j, data[j - 2].discom_shortName);//Buying Utility
          //     // sheet1.set(c + 20, j, data[j - 2].stu_ctu);
          //     j++;
          // }
        }else if(json.stu_transaction_type=='Transmission' && json.ddlStuCtuType=='MPPTCL'){
          var j=2;
          for (var r = 0; r < 1; r++) {
              var c = 0;
              sheet1.set(c + 1, j, j-1);
              sheet1.set(c + 2, j, data[j - 2].month);
              sheet1.set(c + 3, j, data[j - 2].capacity);//Capacity
              sheet1.set(c + 4, j, data[j - 2].billNumber);
              sheet1.set(c + 5, j, data[j - 2].billDate);
              sheet1.set(c + 6, j, data[j - 2].dueDate);
              sheet1.set(c + 7, j, data[j - 2].totalAmount);
              sheet1.set(c + 8, j, "0");//Amount Paid to STU
              sheet1.set(c + 9, j, "remarks");
              // sheet1.set(c + 10, j, "0");//Ref. SPD
              // sheet1.set(c + 11, j, data[j - 2].invoice_number);
              // sheet1.set(c + 12, j, data[j - 2].generation_date);
              // sheet1.set(c + 13, j, data[j - 2].due_date);
              // sheet1.set(c + 14, j, data[j - 2].invoice_amount);
              // sheet1.set(c + 15, j, data[j - 2].date_of_payment);
              // sheet1.set(c + 16, j, data[j - 2].payment_amount);
              // sheet1.set(c + 17, j, data[j - 2].short_payment_amount);
              // sheet1.set(c + 18, j, "");// Remarks 2nd
              // sheet1.set(c + 19, j, data[j - 2].discom_shortName);//Buying Utility
              // sheet1.set(c + 20, j, data[j - 2].stu_ctu);
              j++;
          }
          for (var i = 1; i < 3; i++) {
              for (var s = 1; s < lengthData; s++) {
                  sheet1.border(s, i, {
                      left: 'thin',
                      top: 'thin',
                      right: 'thin',
                      bottom: 'thin'
                  });
                  sheet1.valign(s, i, 'center');
                  if (i > 3 && i < 47) {
                      // sheet1.set(1, i , Number(i) - 3);
                      sheet1.align(1, i, 'center');
                      // sheet1.height(i, 23);
                  }
              }
          }
        }else if(json.stu_transaction_type=='Transmission' && json.ddlStuCtuType=='RVPN'){
          for (var i = 1; i < 4; i++) {
          sheet1.merge({col:i,row:2},{col:i,row:6});
        }
        sheet1.merge({col:8,row:2},{col:8,row:6});
        sheet1.merge({col:9,row:2},{col:9,row:6});
        sheet1.set(1, 2, "1");
        sheet1.set(2, 2, data[0].month);
        sheet1.set(3, 2, "20");
          var v=2;
        for(var k=0;k<5;k++){
        sheet1.set(4, v, data[0].billNumber[k]);
         sheet1.set(5, v, data[0].billDate[k]);
         sheet1.set(6, v, data[0].dueDate[k]);
         sheet1.set(7, v, data[0].totalAmount[k]);
        v++;
        }
        sheet1.set(8, 2, "0");
        sheet1.set(9, 2, "remarks");
        for (var i = 1; i < 7; i++) {
            for (var s = 1; s < lengthData; s++) {
                sheet1.border(s, i, {
                    left: 'thin',
                    top: 'thin',
                    right: 'thin',
                    bottom: 'thin'
                });
                sheet1.valign(s, i, 'center');
                if (i > 3 && i < 47) {
                    // sheet1.set(1, i , Number(i) - 3);
                    sheet1.align(1, i, 'center');
                    // sheet1.height(i, 23);
                }
            }
        }
          // for (var r = 0; r < n; r++) {
          //   var c = 0;
          //   sheet1.set(c + 1, j, j - 1);
          //   sheet1.set(c + 2, j, data[j - 2].month);
          //   sheet1.set(c + 3, j, "");//Capacity
          //   for(var k=0; k<4; k++){
          //    str=str+data[j - 2].billNumber[k]+" ,";
          //    str1=str1+data[j - 2].billDate[k]+" ,";
          //    str2=str2+data[j - 2].dueDate[k]+" ,";
          //    str3=str3+data[j - 2].totalAmount[k]+" ,";
          //   sheet1.set(c + 4, j, str);
          //   sheet1.set(c + 5, j, str1);
          //   sheet1.set(c + 6, j, str2);
          //   sheet1.set(c + 7, j, str3);
          // }
          //   sheet1.set(c + 8, j, "0");//Amount Paid to STU
          //   sheet1.set(c + 9, j, "jjjjjjj");
            // sheet1.set(c + 10, j, "0");//Ref. SPD
            // sheet1.set(c + 11, j, data[j - 2].invoice_number);
            // sheet1.set(c + 12, j, data[j - 2].generation_date);
            // sheet1.set(c + 13, j, data[j - 2].due_date);
            // sheet1.set(c + 14, j, data[j - 2].invoice_amount);
            // sheet1.set(c + 15, j, data[j - 2].date_of_payment);
            // sheet1.set(c + 16, j, data[j - 2].payment_amount);
            // sheet1.set(c + 17, j, data[j - 2].short_payment_amount);
            // sheet1.set(c + 18, j, "");// Remarks 2nd
            // sheet1.set(c + 19, j, data[j - 2].discom_shortName);//Buying Utility
            // sheet1.set(c + 20, j, data[j - 2].stu_ctu);
        //     j++;
        // }
      }else if(json.stu_transaction_type=='Incentive' && json.ddlStuCtuType=='RVPN'){

        }else if(json.stu_transaction_type=='SLDC' && json.ddlStuCtuType=='RVPN'){
          for (var i = 1; i < 3; i++) {
          sheet1.merge({col:i,row:2},{col:i,row:6});
        }
        sheet1.merge({col:7,row:2},{col:7,row:6});
        sheet1.merge({col:8,row:2},{col:8,row:6});
        sheet1.merge({col:9,row:2},{col:9,row:6});
        sheet1.set(1, 2, "1");
        sheet1.set(2, 2, data[0].month);
          var v=2;
        for(var k=0;k<5;k++){
         sheet1.set(3, v, data[0].capacity[k]);
         sheet1.set(4, v, data[0].billNumber[k]);
         sheet1.set(5, v, data[0].billDate[k]);
         sheet1.set(6, v, data[0].dueDate[k]);
        v++;
        }
        sheet1.set(7, 2, "0");
        sheet1.set(8, 2, "0");
        sheet1.set(9, 2, "remarks");
        for (var i = 1; i < 7; i++) {
            for (var s = 1; s < lengthData; s++) {
                sheet1.border(s, i, {
                    left: 'thin',
                    top: 'thin',
                    right: 'thin',
                    bottom: 'thin'
                });
                sheet1.valign(s, i, 'center');
                if (i > 3 && i < 47) {
                    // sheet1.set(1, i , Number(i) - 3);
                    sheet1.align(1, i, 'center');
                    // sheet1.height(i, 23);
                }
            }
        }

          // for (var r = 0; r < n; r++) {
          //   var c = 0;
          //   sheet1.set(c + 1, j, j - 1);
          //   sheet1.set(c + 2, j, data[j - 2].month);
          //   for(var k=0; k<5; k++){
          //    st=st+data[j - 2].capacity[k]+" ,";
          //    str=str+data[j - 2].billNumber[k]+" ,";
          //    str1=str1+data[j - 2].billDate[k]+" ,";
          //    str2=str2+data[j - 2].dueDate[k]+" ,";
          //    // str3=str3+data[j - 2].totalAmount[k]+" ,";
          //
          //   sheet1.set(c + 3, j, st);//Capacity
          //   sheet1.set(c + 4, j, str);
          //   sheet1.set(c + 5, j, str1);
          //   sheet1.set(c + 6, j, str2);
          //   sheet1.set(c + 7, j, "0");
          // }
          //   sheet1.set(c + 8, j, "0");//Amount Paid to STU
          //   sheet1.set(c + 9, j, "jjjjjjj");
            // sheet1.set(c + 10, j, "0");//Ref. SPD
            // sheet1.set(c + 11, j, data[j - 2].invoice_number);
            // sheet1.set(c + 12, j, data[j - 2].generation_date);
            // sheet1.set(c + 13, j, data[j - 2].due_date);
            // sheet1.set(c + 14, j, data[j - 2].invoice_amount);
            // sheet1.set(c + 15, j, data[j - 2].date_of_payment);
            // sheet1.set(c + 16, j, data[j - 2].payment_amount);
            // sheet1.set(c + 17, j, data[j - 2].short_payment_amount);
            // sheet1.set(c + 18, j, "");// Remarks 2nd
            // sheet1.set(c + 19, j, data[j - 2].discom_shortName);//Buying Utility
            // sheet1.set(c + 20, j, data[j - 2].stu_ctu);
        //     j++;
        // }
        }
          var k = 2;
          for (var r = 0; r < 11; r++) {
              for (var c = 1; c < lengthData; c++) {
                  sheet1.align(c, k, 'center');
              }
              k++;
          }
          // border
          // for (var i = 1; i < 6; i++) {
          //     for (var s = 1; s < lengthData; s++) {
          //         sheet1.border(s, i, {
          //             left: 'thin',
          //             top: 'thin',
          //             right: 'thin',
          //             bottom: 'thin'
          //         });
          //         sheet1.valign(s, i, 'center');
          //         if (i > 3 && i < 47) {
          //             // sheet1.set(1, i , Number(i) - 3);
          //             sheet1.align(1, i, 'center');
          //             // sheet1.height(i, 23);
          //         }
          //     }
          // }
          workbook.save(function(ok) {
              console.log('workbook saved ' + (ok ? 'ok' : 'MP Revision Report'));
          });

          Meteor.setTimeout(function() {
              Meteor.call('deleteUploadedFile', process.env.PWD+ filePathForDelete);
          }, 10000);
          return returnSuccess('Excel Created for:', filePath);
      }
        // if (n > 0) {
        //     var sheet1 = workbook.createSheet('sheet1', 21, n + 1);
        //     var dataRow = ["", "Sl. No.", "Month", "Total Capacity(MW)", "STU Invoice No.", "Invoice Date of STU", "Due Date of STU", "Amount raised by STU", "Amount Paid to STU", "Remarks", "Ref. SPD", "Invoice No.(Raised to Buying Utility)", "Invoice Date", "Due Date for Buying Utility", "Invoice Amount", "Date of Amount received", "Actual Amount Received", "Difference ,if any", "Remarks", "Buying Utility", "STU"];
        //     var dataRowWidth = [0, 10, 15, 15, 20, 20, 20, 20, 20, 15, 15, 20, 15, 20, 15, 20, 20, 20, 15, 15, 15];
        //     var lengthData = dataRow.length;
        //     sheet1.height(1, 50);
        //     for (var i = 1; i < lengthData; i++) {
        //         sheet1.set(i, 1, dataRow[i]);
        //         sheet1.font(i, 1, {
        //             sz: '11',
        //             bold: 'true'
        //         });
        //         sheet1.width(i, dataRowWidth[i]);
        //         sheet1.align(i, 1, 'center');
        //         sheet1.valign(i, 1, 'center');
        //     }
        //     var j = 2;
        //     for (var r = 0; r < n; r++) {
        //         var c = 0;
        //         sheet1.set(c + 1, j, j - 1);
        //         sheet1.set(c + 2, j, data[j - 2].period);
        //         sheet1.set(c + 3, j, "");//Capacity
        //         sheet1.set(c + 4, j, data[j - 2].stu_invoiceNum);
        //         sheet1.set(c + 5, j, data[j - 2].stu_invoiceDate);
        //         sheet1.set(c + 6, j, data[j - 2].stu_dueDate);
        //         sheet1.set(c + 7, j, data[j - 2].stu_amountRaised);
        //         sheet1.set(c + 8, j, "0");//Amount Paid to STU
        //         sheet1.set(c + 9, j, data[j - 2].remarks);
        //         sheet1.set(c + 10, j, "0");//Ref. SPD
        //         sheet1.set(c + 11, j, data[j - 2].invoice_number);
        //         sheet1.set(c + 12, j, data[j - 2].generation_date);
        //         sheet1.set(c + 13, j, data[j - 2].due_date);
        //         sheet1.set(c + 14, j, data[j - 2].invoice_amount);
        //         sheet1.set(c + 15, j, data[j - 2].date_of_payment);
        //         sheet1.set(c + 16, j, data[j - 2].payment_amount);
        //         sheet1.set(c + 17, j, data[j - 2].short_payment_amount);
        //         sheet1.set(c + 18, j, "");// Remarks 2nd
        //         sheet1.set(c + 19, j, data[j - 2].discom_shortName);//Buying Utility
        //         sheet1.set(c + 20, j, data[j - 2].stu_ctu);
        //         j++;
        //     }
        //     var k = 2;
        //     for (var r = 0; r < n; r++) {
        //         for (var c = 1; c < lengthData; c++) {
        //             sheet1.align(c, k, 'center');
        //         }
        //         k++;
        //     }
        //     // border
        //     for (var i = 1; i < borderLength; i++) {
        //         for (var s = 1; s < lengthData; s++) {
        //             sheet1.border(s, i, {
        //                 left: 'thin',
        //                 top: 'thin',
        //                 right: 'thin',
        //                 bottom: 'thin'
        //             });
        //             sheet1.valign(s, i, 'center');
        //             if (i > 3 && i < 47) {
        //                 sheet1.set(1, i , Number(i) - 3);
        //                 sheet1.align(1, i, 'center');
        //                 sheet1.height(i, 23);
        //             }
        //         }
        //     }
        //     workbook.save(function(ok) {
        //         console.log('workbook saved ' + (ok ? 'ok' : 'MP Revision Report'));
        //     });
        //
            Meteor.setTimeout(function() {
                Meteor.call('deleteUploadedFile', process.env.PWD + filePathForDelete);
            }, 10000);
        //
        //     return returnSuccess('Excel Created for:', filePath);
        // }
        return returnFaliure('Data is not found!');
      }
});
