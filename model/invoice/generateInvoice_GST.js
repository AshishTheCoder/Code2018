Meteor.methods({
    "generateEnergyDataInvoice_GST": function() {
        var discomNameVar = [];
        var data = Discom.find().fetch();
        data.forEach(function(item){
          if(item.discom_state != 'Maharashtra'){
            discomNameVar.push(item);
          }
        });
        return returnSuccess('Success', discomNameVar);
    },
    // Getting Temporarary Saved Data For PRovisional
    "getTemporarySavedDataForProvisional_GST": function(month, year, discomVar,financialYear, spdSateVar){
      if(discomVar == 'Odisha' || discomVar == 'Bihar'){
        var tempData = TemporaryInvoice.find({month:month,year:year,discom_state:discomVar,type:'Provisional Invoice',financial_year:financialYear,spdState:spdSateVar}).fetch();
      }else{
        var tempData = TemporaryInvoice.find({month:month,year:year,discom_state:discomVar,type:'Provisional Invoice',financial_year:financialYear}).fetch();
      }
      if(tempData.length > 0){
        var returnData = tempData[0];
      }else{
        var returnData = '';
      }
      return returnSuccess('Getting temporary save data of energy invoice',returnData);
    },
    // using for energy invoice
    ViewEnergyInvoiceData_GST: function(month, year, discomVar, spdStateVar, provisonalEnergyVar,financialYearVar,signatureJson) {
      // saving temporary invoice data
      if(discomVar == 'Bihar' || discomVar == 'Odisha'){
        TemporaryInvoice.update(
           { month:month,year:year,discom_state:discomVar,type:'Provisional Invoice',spdState:spdStateVar,financial_year:financialYearVar},
           {
             month:month,
             year:year,
             discom_state:discomVar,
             spdState:spdStateVar,
             type:'Provisional Invoice',
             financial_year:financialYearVar,
             provisional_energy:provisonalEnergyVar,
             signature:signatureJson,
             timestamp: new Date()
           },
           { upsert: true }
        );
      }else{
        TemporaryInvoice.update(
           { month:month,year:year,discom_state:discomVar,type:'Provisional Invoice',financial_year:financialYearVar},
           {
             month:month,
             year:year,
             discom_state:discomVar,
             type:'Provisional Invoice',
             financial_year:financialYearVar,
             provisional_energy:provisonalEnergyVar,
             signature:signatureJson,
             timestamp: new Date()
           },
           { upsert: true }
        );
      }

      // Invoice details starts from here
      if(discomVar == 'Rajasthan'){
        var discomAddress = Discom.find({
            discom_state: discomVar
        }).fetch();
        var addressJson = {
            invoice_raised_to : discomAddress[0].invoice_raised_to,
            discom_name: discomAddress[0].nameof_buyingutility,
            address: discomAddress[0].discom_address,
            address_line_two:discomAddress[0].discom_address_line_two,
            city: discomAddress[0].discom_city,
            state: discomAddress[0].discom_state,
            pin: discomAddress[0].discom_pin,
            amendmentDate1: discomAddress[0].date_of_amendment_one,
            amendmentDate2: discomAddress[0].date_of_amendment_two,
            fax: discomAddress[0].discom_fax,
            name: signatureJson.name,
            designation: signatureJson.designation,
            full_form:signatureJson.full_form,
            phone:signatureJson.phone
        };
        // get period for provisional
        var selectedYear = year;
        var year = moment(date).format('YYYY');
        var dateArr = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
        var fromDateMonth = getArray(dateArr, Number(month));
        var period = fromDateMonth + "'" + selectedYear;
        // finding first and last date of selected month
        var date = new Date(selectedYear, Number(month) - 1, 1);
        var dateArr = [];
        while (date.getMonth() == Number(month) - 1) {
            var update = date.getDate() + "-" + Number(month) + "-" + Number(selectedYear);
            var newDate = update.split("-");
            var myObject = new Date(newDate[2], newDate[1] - 1, newDate[0]);
            dateArr.push(myObject);
            date.setDate(date.getDate() + 1);
        }
        var firstDate = dateArr[0];
        var lastDate = dateArr[Number(dateArr.length - 1)];
        var startDateOfMonth = moment(firstDate).format("DD MMMM YYYY");
        var startDateOfMonthToInsert = moment(firstDate).format("DD-MM-YYYY");
        var endDateOfMonth = moment(lastDate).format("DD MMMM YYYY");
        var endDateOfMonthToInsert = moment(lastDate).format("DD-MM-YYYY");
        // getting current date and due date
        var currentDate = new Date();
        var dateFormat = moment(currentDate).format("DD MMMM YYYY");
        var dateFormatToInsert = moment(currentDate).format('DD-MM-YYYY');
        var myDate = moment().add(30, 'days');
        var duedate = myDate.format('DD-MM-YYYY');
        var dueDateForViewOnly = myDate.format('DD MMMM YYYY');

        var referenceNumber = '';
        var invoiceNumber = '';
        var numberOfGeneration = 1;
        var checkData = EnergyInvoiceDetails.find({discom_state:discomVar,month:month,year:selectedYear,financial_year :financialYearVar,type:'Provisional_Invoice',delete_status:false},{sort: {$natural: -1},limit: 1}).fetch();
        if(checkData.length > 0){
          if(checkData[0].month == month && checkData[0].year == selectedYear && checkData[0].financial_year == financialYearVar){
              numberOfGeneration = (Number(checkData[0].numberOfGeneration) + Number(1));
          }
        }
        referenceNumber = 'SECI/PS/JNNSM-750/RUVNL/'+selectedYear+"/"+fromDateMonth+"/"+ numberOfGeneration;
        // gettimg grnad total for all
        var data = Discom.find({discom_state: discomVar}).fetch();

        var energyInvoiceRate = InvoiceCharges.find({state:discomVar,invoice_type:'Energy_Invoice',financial_year:financialYearVar}).fetch();
        if(energyInvoiceRate.length > 0){
          var ratePerUnit = Number(energyInvoiceRate[0].rate).toFixed(2);
        }else{
          var ratePerUnit = Number(1).toFixed(2);
        }
        var grandTotalVar = Number(ratePerUnit) * Number(provisonalEnergyVar);
        //for jaipur discom 40 Percentage
        var energyJaipur = ((Number(provisonalEnergyVar) * 40)/100).toFixed(2);
        var amountJaipur = ((Number(grandTotalVar) * 40)/100).toFixed(2);
            invoiceNumberJaipur = 'SECI/INTRA/RAJASTHAN/JAIPUR DISCOM/'+selectedYear+"/"+fromDateMonth+"/"+ numberOfGeneration;
        var jsonForJaipurIndividualProvisional = {invoice_number:invoiceNumberJaipur,invoice_date:dateFormat,due_date:dueDateForViewOnly,period_start_date:startDateOfMonth, period_end_date:endDateOfMonth,energy:amountInComman(energyJaipur),rate:ratePerUnit,period:period,amount:amountInComman(amountJaipur),amount_inwords:amountInWords(amountJaipur)};
        //for ajmer 28 Percentage
        var energyAjmer = ((Number(provisonalEnergyVar) * 28)/100).toFixed(2);
        var amountAjmer = ((Number(grandTotalVar) * 28)/100).toFixed(2);
            invoiceNumberAjmer = 'SECI/INTRA/RAJASTHAN/AJMER DISCOM/'+selectedYear+"/"+fromDateMonth+"/"+ numberOfGeneration;
        var jsonForAjmerIndividualProvisional = {invoice_number:invoiceNumberAjmer,invoice_date:dateFormat,due_date:dueDateForViewOnly,period_start_date:startDateOfMonth, period_end_date:endDateOfMonth,energy:amountInComman(energyAjmer),rate:ratePerUnit,period:period,amount:amountInComman(amountAjmer),amount_inwords:amountInWords(amountAjmer)};
        //for Jodhpur 32 Percentage
        var energyJodhpur = ((Number(provisonalEnergyVar) * 32)/100).toFixed(2);
        var amountJodhpur = ((Number(grandTotalVar) * 32)/100).toFixed(2);
            invoiceNumberJodhpur = 'SECI/INTRA/RAJASTHAN/JODHPUR DISCOM/'+selectedYear+"/"+fromDateMonth+"/"+ numberOfGeneration;
        var jsonForJodhpurIndividualProvisional = {invoice_number:invoiceNumberJodhpur,invoice_date:dateFormat,due_date:dueDateForViewOnly,period_start_date:startDateOfMonth, period_end_date:endDateOfMonth,energy:amountInComman(energyJodhpur),rate:ratePerUnit,period:period,amount:amountInComman(amountJodhpur),amount_inwords:amountInWords(amountJodhpur)};
        //main sheet for RUVNL
        var grandTotalForShow = Math.round(Number((grandTotalVar))).toFixed(2);
            invoiceNumber = 'SECI/INTRA/RAJASTHAN/RUVNL/'+selectedYear+"/"+fromDateMonth+"/"+ numberOfGeneration;
        var jsonForMainSheetRUVNLProvisional = {invoice_number:invoiceNumber,percentage_jaipur:'40%',percentage_ajmer:'28%',percentage_jodhpur:'32%',invoice_date:dateFormat,due_date:dueDateForViewOnly,period_start_date:startDateOfMonth,period_end_date:endDateOfMonth,energyJaipur:amountInComman(energyJaipur),amountJaipur:amountInComman(amountJaipur),energyAjmer:amountInComman(energyAjmer),amountAjmer:amountInComman(amountAjmer),energyJodhpur:amountInComman(energyJodhpur),amountJodhpur:amountInComman(amountJodhpur),energy:provisonalEnergyVar,rate:ratePerUnit,period:period,amount:amountInComman(grandTotalForShow),amount_inwords:amountInWords(grandTotalForShow)};
        //cover letter json
        var grnadTotal = (Number(amountJaipur) + Number(amountAjmer) + Number(amountJodhpur)).toFixed(2);
        var jsonForCoverProvisional = {addressJson:addressJson,reference_number:referenceNumber,invoice_date:dateFormat,period:period,amount:amountInComman(grnadTotal),amount_inwords:amountInWords(grnadTotal)};
        //data insert in EnergyInvoiceDetails collection
        var jsonToInsert = {
          reference_number: referenceNumber,
          invoice_number:invoiceNumber,
          numberOfGeneration: Number(numberOfGeneration),
          discom_id: data[0]._id,
          discom_name: data[0].nameof_buyingutility,
          discom_short_name:data[0].discom_short_name,
          discom_state: discomVar,
          energy_invoice_generation_date:dateFormatToInsert,
          energy_invoice_due_date: duedate,
          month: month,
          year: selectedYear,
          financial_year:financialYearVar,
          rate_per_unit:ratePerUnit,
          total_energy:provisonalEnergyVar,
          total_amount: grnadTotal,
          type:'Provisional_Invoice',
          typeOfInvoice:'Provisional Invoice',
          delete_status:false,
          timestamp:new Date(),
          // jaipur discom json
          jaipur_discom:{
            reference_number: referenceNumber,
            invoice_number:invoiceNumberJaipur,
            numberOfGeneration: Number(numberOfGeneration),
            discom_name:'JAIPUR DISCOM',
            discom_state: discomVar,
            energy_invoice_generation_date:dateFormatToInsert,
            energy_invoice_due_date: duedate,
            month: month,
            year: selectedYear,
            financial_year:financialYearVar,
            rate_per_unit:ratePerUnit,
            total_energy:energyJaipur,
            total_amount: amountJaipur,
            period:period,
            period_start_date:startDateOfMonthToInsert,
            period_end_date:endDateOfMonthToInsert,
            type:'Provisional_Invoice',
            timestamp:new Date(),
          },
          // ajmer discom json
          ajmer_discom:{
            reference_number: referenceNumber,
            invoice_number:invoiceNumberAjmer,
            discom_name:'AJMER DISCOM',
            discom_state: discomVar,
            energy_invoice_generation_date:dateFormatToInsert,
            energy_invoice_due_date: duedate,
            month: month,
            year: selectedYear,
            financial_year:financialYearVar,
            rate_per_unit:ratePerUnit,
            total_energy:energyAjmer,
            total_amount:amountAjmer,
            period:period,
            period_start_date:startDateOfMonthToInsert,
            period_end_date:endDateOfMonthToInsert,
            type:'Provisional_Invoice',
            timestamp:new Date()
          },
          // jodhpur discom json
          jodhpur_discom:{
            reference_number: referenceNumber,
            invoice_number:invoiceNumberJodhpur,
            discom_name:'JODHPUR DISCOM',
            discom_state: discomVar,
            energy_invoice_generation_date:dateFormatToInsert,
            energy_invoice_due_date: duedate,
            month: month,
            year: selectedYear,
            financial_year:financialYearVar,
            rate_per_unit:ratePerUnit,
            total_energy:energyJodhpur,
            total_amount:amountJodhpur,
            period:period,
            period_start_date:startDateOfMonthToInsert,
            period_end_date:endDateOfMonthToInsert,
            type:'Provisional_Invoice',
            timestamp:new Date()
          }
        };
        //made fianl json to return all data to ui
        var returnJson = {cover_leter:jsonForCoverProvisional,main_sheet:jsonForMainSheetRUVNLProvisional,jaipur_detail:jsonForJaipurIndividualProvisional,ajmer_detail:jsonForAjmerIndividualProvisional,jodhpur_detail:jsonForJodhpurIndividualProvisional};
        var bigArray = {returnJson:returnJson,jsonToInsert:jsonToInsert};

        var TodayDateVar = moment().format('DD-MM-YYYY');
        var random = Math.floor((Math.random() * 10000) + 1).toString();
        var pdfFileName = 'Rajasthan_Provisional_'+'_'+TodayDateVar+'_'+random;
        Meteor.call('GST_generatingRajasthanProvisionalEnergyInvoicePDF',returnJson, pdfFileName);
        var path = "/upload/Invoices/RajasthanProvisionalInvoice/"+pdfFileName+".pdf";
        var pathDocx = "/upload/Invoices/RajasthanProvisionalInvoice/"+pdfFileName+".docx";
        jsonToInsert.file_path = path;
        jsonToInsert.file_path_docx = pathDocx;
        // Insert Query For Rajasthan Provisional Invoice
        EnergyInvoiceDetails.insert(jsonToInsert);
        var ip = this.connection.httpHeaders['x-forwarded-for'];
        var ipArr = ip.split(',');
        var logJson = {
          ip_address : ipArr,
          log_type: 'Rajasthan Provisional Energy Invoice Generated',
          template_name: 'generateInvoice',
          event_name: 'energyBtnView',
          state:discomVar,
          json:jsonToInsert
        }
        // Send Json To insert Log Details by using insertJsonForInvoiceLog method
        var invoiceLog = insertJsonForInvoiceLog(logJson);

      }else{
        var spdDataArr = [];

        if(discomVar == 'Rajasthan(APMPL)'){
          var energyInvoiceRate = InvoiceCharges.find({state:'Rajasthan',invoice_type:'Energy_Invoice',financial_year:financialYearVar}).fetch();
        }else{
          var energyInvoiceRate = InvoiceCharges.find({state:discomVar,invoice_type:'Energy_Invoice',financial_year:financialYearVar}).fetch();
        }
        if(energyInvoiceRate.length > 0){
          var rate = Number(energyInvoiceRate[0].rate).toFixed(2);
        }else{
          var rate = Number(1).toFixed(2);
        }
        var discomAddress = Discom.find({
            discom_state: discomVar
        }).fetch();
        discomAddress[0].spdIds.forEach(function(item) {
            // using if condition for odisha discom, to get Invoice for different State
            if (discomVar == 'Odisha' || discomVar == 'Maharashtra') {
                if (item.spdState == spdStateVar) {
                    spdDataArr.push({spd_id:item.spdId, spd_name:item.spdName});
                }
            }else if (discomVar == 'Rajasthan(APMPL)') {
                //here if condition used for spd name-Azure Power Mars Pvt. condition
                if (item.spdState == 'Rajasthan') {
                      spdDataArr.push({spd_id:item.spdId, spd_name:item.spdName});
                }
            } else {
                  spdDataArr.push({spd_id:item.spdId, spd_name:item.spdName});
            }
        });
        var dateArr = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
        var fromDateMonth = getArray(dateArr, Number(month));
        var period = fromDateMonth + "'" + year;

        var spdNames = [];
        var spdNames = '';
        var particularsOfClaim = '';
        var regionalArea = '';
        var state = discomVar;
        var unknownVar = '';
        var transactionTypeVarForEnclosed = '';

        var numberOfGeneration = 1;
        var checkData = EnergyInvoiceDetails.find({discom_state: discomVar,financial_year:financialYearVar,year: year,month: month, delete_status:false}, {sort: {$natural: -1},limit: 1}).fetch();
        if (checkData.length > 0) {
            if (checkData[0].month == month && checkData[0].year == year && checkData[0].financial_year == financialYearVar) {
              numberOfGeneration = Number(checkData[0].numberOfGeneration + 1);
            }
        }
        var referenceNumberVar = '';
        var invoiceNumberVar = '';
        if (discomVar == 'Rajasthan(APMPL)') {
            unknownVar = 'RVPNL JMR';
            regionalArea = '';
            transactionTypeVarForEnclosed = 'Intra';
            particularsOfClaim = "Energy by SECI to JODHPUR Discom";
            spdNames = 'of M/s '+spdDataArr[0].spd_name;
            referenceNumberVar = "SECI/PS/JdVVNL/" + year + '/' + fromDateMonth + '/' + numberOfGeneration;
            invoiceNumberVar = 'SECI/INTRA/RAJASTHAN/AZURE POWER MARS/' + period + '/'+ numberOfGeneration;
        }
        else if (discomVar == 'Haryana') {
          unknownVar = 'NRPC REA';
          regionalArea = '(As certified in REA of NRPC)';
          transactionTypeVarForEnclosed = 'Inter';
          particularsOfClaim = "Northern Solar Prakash Pvt. Ltd., Azure Green Tech Pvt. Ltd. & Azure Sunshine Pvt. Ltd. power by SECI to "+discomAddress[0].discom_short_name;
          spdNames = 'of M/s Northern Solar Prakash Pvt. Ltd., M/s Azure Green Tech Pvt. Ltd. & M/s Azure Sunshine Pvt. Ltd.';
          referenceNumberVar = "SECI/PS/" + discomAddress[0].discom_short_name + '/' + year + '/' + fromDateMonth + '/' + numberOfGeneration;
          invoiceNumberVar = 'SECI/OA/' + discomAddress[0].discom_short_name+'/RAJASTHAN/'+ period + '/'+ numberOfGeneration;
       }
        else if (discomVar == 'Punjab') {
          unknownVar = 'NRPC REA';
          regionalArea = '(As certified in REA of NRPC)';
          transactionTypeVarForEnclosed = 'Inter';
          particularsOfClaim = "Today Green Energy Pvt. Ltd. power by SECI to "+discomAddress[0].discom_short_name;
          spdNames = 'of M/s Today Green Energy Pvt. Ltd.';
          referenceNumberVar = "SECI/PS/" + discomAddress[0].discom_short_name + '/' + year + '/' + fromDateMonth + '/' + numberOfGeneration;
          invoiceNumberVar = 'SECI/OA/' + discomAddress[0].discom_short_name+'/RAJASTHAN/'+ period + '/'+ numberOfGeneration;
       }
        else if (discomVar == 'Delhi(BRPL)' || discomVar == 'Delhi(BYPL)' || discomVar == 'Delhi(TPDDL)' || discomVar == 'Assam' || discomVar == 'Himachal Pradesh') {
          unknownVar = 'NRPC REA';
          regionalArea = '(As certified in REA of NRPC)';
          transactionTypeVarForEnclosed = 'Inter';
          particularsOfClaim = spdDataArr[0].spd_name+ " power by SECI to "+discomAddress[0].discom_short_name;
          spdNames = 'of M/s '+ spdDataArr[0].spd_name;
          referenceNumberVar = "SECI/PS/" + discomAddress[0].discom_short_name + '/' + year + '/' + fromDateMonth + '/' + numberOfGeneration;
          invoiceNumberVar = 'SECI/OA/' + discomAddress[0].discom_short_name+'/RAJASTHAN/'+ period + '/'+ numberOfGeneration;
       }
        else if (discomVar == 'Jharkhand') {
          unknownVar = 'NRPC REA';
          regionalArea = '(As certified in REA of NRPC)';
          transactionTypeVarForEnclosed = 'Inter';
          particularsOfClaim = "Laxmi Diamond Private Limited power by SECI to "+discomAddress[0].discom_short_name;
          spdNames = 'of M/s Laxmi Diamond Private Limited';
          referenceNumberVar = "SECI/PS/" + discomAddress[0].discom_short_name + '/' + year + '/' + fromDateMonth + '/' + numberOfGeneration;
          invoiceNumberVar = 'SECI/OA/' + discomAddress[0].discom_short_name+'/RAJASTHAN/'+ period + '/'+ numberOfGeneration;
       }
        else if (discomVar == 'MP') {
          unknownVar = 'MPPTCL SEA';
          regionalArea = '(As certified in SEA of MPPTCL)';
          transactionTypeVarForEnclosed = 'Intra';
          particularsOfClaim = '';
          spdNames = '';
          referenceNumberVar = "SECI/PS/" + discomAddress[0].discom_short_name + '/' + year + '/' + fromDateMonth + '/' + numberOfGeneration;
          invoiceNumberVar = 'SECI/OA/' + discomAddress[0].discom_short_name+"/FINNSURYA-SEI L'VOLTA-SEI SITARA-CLEAN SOLAR-FOCAL-PHOTO/"+ period + '/'+ numberOfGeneration;
        }
        else if (discomVar == 'Tamil Nadu') {
          unknownVar = 'T.E.D.C JMR';
          regionalArea = '(As certified in JMR of T.E.D.C)';
          transactionTypeVarForEnclosed = 'Intra';
          particularsOfClaim = "SWELECT power by SECI to "+discomAddress[0].discom_short_name;
          spdNames = '';
          referenceNumberVar = "SECI/PS/" + discomAddress[0].discom_short_name + '/' + year + '/' + fromDateMonth + '/' + numberOfGeneration;
          invoiceNumberVar = 'SECI/INTRA/' + discomAddress[0].discom_short_name+'/SWELECT/'+ period + '/'+ numberOfGeneration;
       }
        else if (discomVar == 'Karnataka') {
          unknownVar = 'KPTCL JMR';
          regionalArea = '(As certified in JMR of KPCL)';
          transactionTypeVarForEnclosed = 'Intra';
          particularsOfClaim = "KPCL power by SECI to "+discomAddress[0].discom_short_name;
          spdNames = 'of M/s KPCL';
          referenceNumberVar = "SECI/PS/" + discomAddress[0].discom_short_name + '/' + year + '/' + fromDateMonth + '/' + numberOfGeneration;
          invoiceNumberVar = 'SECI/INTRA/'+ discomAddress[0].discom_short_name+'/KPCL/'+ period + '/'+ numberOfGeneration;
       }
         else if (discomVar == 'Chhattisgarh') {
           unknownVar = 'WRPC REA';
           regionalArea = '(As certified in REA of WRPC)';
           transactionTypeVarForEnclosed = 'Inter';
           particularsOfClaim = "Focal Energy Solar One India Pvt. Ltd. and Waneep Solar Pvt. Ltd. power by SECI to "+discomAddress[0].discom_short_name;
           spdNames = "of Focal Energy Solar One India Pvt. Ltd. and Waneep Solar Pvt. Ltd. power by SECI to "+discomAddress[0].discom_short_name;
           referenceNumberVar = "SECI/PS/" + discomAddress[0].discom_short_name + '/' + year + '/' + fromDateMonth + '/' + numberOfGeneration;
           invoiceNumberVar = 'SECI/OA/' + discomAddress[0].discom_short_name+'/MP/'+ period + '/'+ numberOfGeneration;
        }
        else if (discomVar == 'Goa') {
          unknownVar = 'WRPC REA';
          regionalArea = '(As certified in REA of WRPC)';
          transactionTypeVarForEnclosed = 'Inter';
          particularsOfClaim = "IL & FS Energy Development Company Ltd. power by SECI to "+discomAddress[0].discom_short_name;
          spdNames = "of IL & FS Energy Development Company Ltd. power by SECI to "+discomAddress[0].discom_short_name;
          referenceNumberVar = "SECI/PS/" + discomAddress[0].discom_short_name + '/' + year + '/' + fromDateMonth + '/' + numberOfGeneration;
          invoiceNumberVar = 'SECI/OA/' + discomAddress[0].discom_short_name+"/MP/" + period + '/'+ numberOfGeneration;
       }
       else if (discomVar == 'Bihar') {
         if (spdStateVar == 'North') {
           unknownVar = 'WRPC REA';
           regionalArea = '(As certified in REA of WRPC)';
           transactionTypeVarForEnclosed = 'Inter';
           particularsOfClaim = "Focal Renewable Energy Two India Pvt. Ltd. power by SECI to "+'N'+discomAddress[0].discom_short_name;
           spdNames = "of M/s Focal Renewable Energy Two India Pvt. Ltd. power by SECI to "+ 'N'+discomAddress[0].discom_short_name;
           referenceNumberVar = "SECI/PS/" + 'N'+discomAddress[0].discom_short_name + '/' + year + '/' + fromDateMonth + '/' + numberOfGeneration;
           invoiceNumberVar = 'SECI/OA/' + 'N'+discomAddress[0].discom_short_name+"/MP/" + period + '/'+ numberOfGeneration;
         }else if(spdStateVar == 'South'){
           unknownVar = 'WRPC REA';
           regionalArea = '(As certified in REA of WRPC)';
           transactionTypeVarForEnclosed = 'Inter';
           particularsOfClaim = "Focal Renewable Energy Two India Pvt. Ltd. power by SECI to "+'S'+discomAddress[0].discom_short_name;
           spdNames = "of M/s Focal Renewable Energy Two India Pvt. Ltd. power by SECI to "+ 'S'+discomAddress[0].discom_short_name;
           referenceNumberVar = "SECI/PS/" + 'S'+discomAddress[0].discom_short_name + '/' + year + '/' + fromDateMonth + '/' + numberOfGeneration;
           invoiceNumberVar = 'SECI/OA/' + 'S'+discomAddress[0].discom_short_name+"/MP/" + period + '/'+ numberOfGeneration;
         }
      }
        else if (discomVar == 'Odisha') {
            if (spdStateVar == 'Gujarat') {
                unknownVar = 'WR REA';
                regionalArea = '';
                transactionTypeVarForEnclosed = 'Inter';
                particularsOfClaim = "GPCL, GSECL, BACKBONE and ENERSAN power by SECI to "+discomAddress[0].discom_short_name;
                spdNames = "of GPCL, GSECL, BACKBONE and ENERSAN power by SECI to "+discomAddress[0].discom_short_name;
                referenceNumberVar = "SECI/PS/" + discomAddress[0].discom_short_name + '/' + year + '/' + fromDateMonth + '/' + numberOfGeneration;
                invoiceNumberVar = 'SECI/OA/' + discomAddress[0].discom_short_name+"/GPCL/GSECL/ENERSAN/BACKBONE/" + period + '/'+ numberOfGeneration;

            }else if(spdStateVar == 'Rajasthan'){
                unknownVar = 'NRPC REA';
                regionalArea = '(As certified in REA of NRPC)';
                transactionTypeVarForEnclosed = 'Intra';
                particularsOfClaim = spdDataArr[0].spd_name+" power by SECI to "+discomAddress[0].discom_short_name;
                spdNames = spdDataArr[0].spd_name;
                referenceNumberVar = "SECI/PS/" + discomAddress[0].discom_short_name + '/' + year + '/' + fromDateMonth + '/' + numberOfGeneration;
                invoiceNumberVar = 'SECI/OA/' + discomAddress[0].discom_short_name+'/' + 'RAJASTHAN' + '/' + period + '/'+ numberOfGeneration;
            }else if(spdStateVar == 'Odisha'){
                unknownVar = 'SEA';
                spdNames = '';
            }
        }
        else if (discomVar == 'Maharashtra') {
            if (spdStateVar == 'Rajasthan') {
                unknownVar = 'SEA';
                spdNames = '';
                transactionTypeVarForEnclosed = 'Inter';
            }
        }
        else if (discomVar == 'New Delhi(NTPC)') {
          unknownVar = 'JMR';
          regionalArea = '';
          transactionTypeVarForEnclosed = 'Intra';
          particularsOfClaim = "power to "+discomAddress[0].discom_short_name;
          spdNames = '';
          referenceNumberVar = "SECI/PS/" + discomAddress[0].discom_short_name + '/' + year + '/' + fromDateMonth + '/' + numberOfGeneration;
          invoiceNumberVar = 'SECI/INTRA/RAJASTHAN/'+ period + '/'+ numberOfGeneration;
       }
        else if (discomVar == 'New Delhi') {
          unknownVar = 'JMR';
          regionalArea = '';
          transactionTypeVarForEnclosed = 'Intra';
          particularsOfClaim = "Provisional Invoice of sell of "+spdDataArr[0].spd_name+ " power by SECI to "+discomAddress[0].discom_short_name;
          spdNames = 'M/s '+spdDataArr[0].spd_name;
          referenceNumberVar = "SECI/PS/" + discomAddress[0].discom_short_name + '/' + year + '/' + fromDateMonth + '/' + numberOfGeneration;
          invoiceNumberVar = 'SECI/INTRA/'+discomAddress[0].discom_short_name+'/'+ period + '/'+ numberOfGeneration;
       }
        if (discomVar == 'Delhi(BRPL)' || discomVar == 'Delhi(BYPL)' || discomVar == 'Delhi(TPDDL)') {
            var addressJson = {
                invoice_raised_to : discomAddress[0].invoice_raised_to,
                discom_name: discomAddress[0].nameof_buyingutility,
                discomShortName : discomAddress[0].discom_short_name,
                address: discomAddress[0].discom_address,
                address_line_two:discomAddress[0].discom_address_line_two,
                city: discomAddress[0].discom_city,
                state: 'Delhi',
                pin: discomAddress[0].discom_pin,
                user_schedule_type: unknownVar,
                transaction_type:transactionTypeVarForEnclosed,
                amendmentDate1: discomAddress[0].date_of_amendment_one,
                fax: discomAddress[0].discom_fax,
                name: signatureJson.name,
                designation: signatureJson.designation,
                full_form:signatureJson.full_form,
                phone:signatureJson.phone
            }
            state = 'Delhi';
        } else if (discomVar == 'Bihar') {
            var addressJson = {
                invoice_raised_to : discomAddress[0].invoice_raised_to,
                discom_name: spdStateVar+' '+discomAddress[0].nameof_buyingutility,
                discomShortName : discomAddress[0].discom_short_name,
                address: discomAddress[0].discom_address,
                address_line_two:discomAddress[0].discom_address_line_two,
                city: discomAddress[0].discom_city,
                state: discomAddress[0].discom_state,
                pin: discomAddress[0].discom_pin,
                user_schedule_type: unknownVar,
                transaction_type:transactionTypeVarForEnclosed,
                amendmentDate1: discomAddress[0].date_of_amendment_one,
                amendmentDate2: discomAddress[0].date_of_amendment_two,
                fax: discomAddress[0].discom_fax,
                name: signatureJson.name,
                designation: signatureJson.designation,
                full_form:signatureJson.full_form,
                phone:signatureJson.phone
            }
        } else if (discomVar == 'MP') {
            var addressJson = {
                invoice_raised_to : discomAddress[0].invoice_raised_to,
                discom_name: discomAddress[0].nameof_buyingutility,
                discomShortName : discomAddress[0].discom_short_name,
                address: discomAddress[0].discom_address,
                address_line_two:discomAddress[0].discom_address_line_two,
                city: discomAddress[0].discom_city,
                state: discomAddress[0].discom_state,
                pin: discomAddress[0].discom_pin,
                user_schedule_type: unknownVar,
                transaction_type:transactionTypeVarForEnclosed,
                amendmentDate1: discomAddress[0].date_of_amendment_one,
                amendmentDate2: discomAddress[0].date_of_amendment_two,
                fax: discomAddress[0].discom_fax,
                name: signatureJson.name,
                designation: signatureJson.designation,
                full_form:signatureJson.full_form,
                phone:signatureJson.phone
            }
        } else if (discomVar == 'Rajasthan(APMPL)') {
            var addressJson = {
                invoice_raised_to : discomAddress[0].invoice_raised_to,
                discom_name: 'Rajasthan Urja Vikas Nigam Ltd.',
                discomShortName : 'JdVVNL',
                address: discomAddress[0].discom_address,
                address_line_two:discomAddress[0].discom_address_line_two,
                city: discomAddress[0].discom_city,
                state: 'Rajasthan',
                pin: discomAddress[0].discom_pin,
                user_schedule_type: unknownVar,
                transaction_type:transactionTypeVarForEnclosed,
                amendmentDate1: '06/11/2015',
                amendmentDate2: discomAddress[0].date_of_amendment_two,
                fax: 'N/A',
                name: signatureJson.name,
                designation: signatureJson.designation,
                full_form:signatureJson.full_form,
                phone:signatureJson.phone
            }
        }else if (discomVar == 'New Delhi(NTPC)') {
            var addressJson = {
              invoice_raised_to : discomAddress[0].invoice_raised_to,
              discom_name: discomAddress[0].nameof_buyingutility,
              discomShortName : discomAddress[0].discom_short_name,
              address: discomAddress[0].discom_address,
              address_line_two:discomAddress[0].discom_address_line_two,
              city: discomAddress[0].discom_city,
              user_schedule_type: unknownVar,
              transaction_type:transactionTypeVarForEnclosed,
              state: 'New Delhi',
              pin: discomAddress[0].discom_pin,
              amendmentDate1: discomAddress[0].date_of_amendment_one,
              fax: discomAddress[0].discom_fax,
              name: signatureJson.name,
              designation: signatureJson.designation,
              full_form:signatureJson.full_form,
              phone:signatureJson.phone
            }
        } else {
            var addressJson = {
                invoice_raised_to : discomAddress[0].invoice_raised_to,
                discom_name: discomAddress[0].nameof_buyingutility,
                discomShortName : discomAddress[0].discom_short_name,
                address: discomAddress[0].discom_address,
                address_line_two:discomAddress[0].discom_address_line_two,
                city: discomAddress[0].discom_city,
                user_schedule_type: unknownVar,
                transaction_type:transactionTypeVarForEnclosed,
                state: discomAddress[0].discom_state,
                pin: discomAddress[0].discom_pin,
                amendmentDate1: discomAddress[0].date_of_amendment_one,
                fax: discomAddress[0].discom_fax,
                name: signatureJson.name,
                designation: signatureJson.designation,
                full_form:signatureJson.full_form,
                phone:signatureJson.phone
            }
        }
        if(discomVar == 'Bihar'){
          if(spdStateVar == 'North'){
            var biharRatio = 46;
            var energy_percentage = Number((Number(provisonalEnergyVar) * Number(biharRatio))/100);
            var dataJson= {
                    sn: 1,
                    spd_name: spdNames,
                    spd_direction:'North',
                    kwh: Number(provisonalEnergyVar),
                    percentage:biharRatio,
                    calculated_percentage:Number(energy_percentage).toFixed(0),
                    rate: Number(rate).toFixed(2),
                    amount: amountInComman((Number(energy_percentage) * Number(rate)).toFixed(2))
                };
            var grandTotal = (Number(energy_percentage) * Number(rate)).toFixed(2);
          }else if(spdStateVar == 'South'){
            var biharRatio = 54;
            var energy_percentage = Number((Number(provisonalEnergyVar) * Number(biharRatio))/100);
            var dataJson= {
                    sn: 1,
                    spd_name: spdNames,
                    spd_direction:'South',
                    kwh: Number(provisonalEnergyVar),
                    percentage:biharRatio,
                    calculated_percentage:Number(energy_percentage).toFixed(0),
                    rate: Number(rate).toFixed(2),
                    amount: amountInComman((Number(energy_percentage) * Number(rate)).toFixed(2))
                };
            var grandTotal = (Number(energy_percentage) * Number(rate)).toFixed(2);
          }
        }else if(discomVar == 'MP'){
          var dataJson1= {
                  sn: 1,
                  spd_name: 'Provisional Energy Bill of M/s SEI Sitara Pvt. Ltd. for the month of '+period,
                  kwh: Number(provisonalEnergyVar),
                  rate: Number(rate).toFixed(2),
                  amount: amountInComman((Number(provisonalEnergyVar) * Number(rate)).toFixed(2))
              };
          var grandTotal1 = (Number(provisonalEnergyVar) * Number(rate)).toFixed(2);
          var dataJson2= {
                  sn: 2,
                  spd_name: 'Provisional Energy Bill of M/s Fortum FinnSurya Energy Pvt. Ltd. for the month of '+period,
                  kwh: Number(provisonalEnergyForFortum),
                  rate: Number(rate).toFixed(2),
                  amount: amountInComman((Number(provisonalEnergyForFortum) * Number(rate)).toFixed(2))
              };
          var grandTotal2 = (Number(provisonalEnergyForFortum) * Number(rate)).toFixed(2);
          var dataJson3= {
                  sn: 3,
                  spd_name: 'Provisional Energy Bill of M/s Clean Solar Power (Dhar) Pvt. Ltd. for the month of '+period,
                  kwh: Number(provisonalEnergyForClean),
                  rate: Number(rate).toFixed(2),
                  amount: amountInComman((Number(provisonalEnergyForClean) * Number(rate)).toFixed(2))
              };
          var grandTotal3 = (Number(provisonalEnergyForClean) * Number(rate)).toFixed(2);
          var dataJson4= {
                  sn: 4,
                  spd_name: 'Provisional Energy Bill of M/s Focal Photovoltaic India Pvt. Ltd. for the month of '+period,
                  kwh: Number(provisonalEnergyForFocal),
                  rate: Number(rate).toFixed(2),
                  amount: amountInComman((Number(provisonalEnergyForFocal) * Number(rate)).toFixed(2))
              };
          var grandTotal4 = (Number(provisonalEnergyForFocal) * Number(rate)).toFixed(2);
          var grandTotal = Number(Number(grandTotal1) + Number(grandTotal2) + Number(grandTotal3) + Number(grandTotal4)).toFixed(2);
          var totalEnergy = Number(Number(provisonalEnergyVar) + Number(provisonalEnergyForFortum) + Number(provisonalEnergyForClean) + Number(provisonalEnergyForFocal));
          var dataJson = {dataJson1:dataJson1,dataJson2:dataJson2,dataJson3:dataJson3,dataJson4:dataJson4,grandTotal:grandTotal,totalEnergy:totalEnergy};
        }else{
          var dataJson= {
                  sn: 1,
                  spd_name: spdNames,
                  kwh: Number(provisonalEnergyVar),
                  rate: Number(rate).toFixed(2),
                  amount: amountInComman((Number(provisonalEnergyVar) * Number(rate)).toFixed(2))
              };
          var grandTotal = (Number(provisonalEnergyVar) * Number(rate)).toFixed(2);
        }

        //----------using collection for storing invoice no or data-----

        var date = new Date(year, Number(month) - 1, 1);
        var dateArr = [];
        while (date.getMonth() == Number(month) - 1) {
            var update = date.getDate() + "-" + Number(month) + "-" + Number(year);
            var newDate = update.split("-");
            var myObject = new Date(newDate[2], newDate[1] - 1, newDate[0]);
            dateArr.push(myObject);
            date.setDate(date.getDate() + 1);
        }
        var firstDate = dateArr[0];
        var lastDate = dateArr[Number(dateArr.length - 1)];
        var startDateOfMonth = moment(firstDate).format("DD MMMM YYYY");
        var endDateOfMonth = moment(lastDate).format("DD MMMM YYYY");

        var currentDate = new Date();
        var dateFormat = moment(currentDate).format("DD MMMM YYYY");
        var dateFormatToInsert = moment(currentDate).format('DD-MM-YYYY');
        if (discomVar == 'New Delhi(NTPC)') {
          var curDT = moment().format('DD');
          if (Number(curDT) <= 15) {
            var nextMonth = moment().add(1, 'months');
            var nextDueDate = nextMonth.format('MM-YYYY');
            var duedate = '05-'+nextDueDate;
            var dueDateForViewOnly = '05-'+nextMonth.format('MMMM-YYYY');
          }else {
            var nextMonth = moment().add(2, 'months');
            var nextDueDate = nextMonth.format('MM-YYYY');
            var duedate = '05-'+nextDueDate;
            var dueDateForViewOnly = '05-'+nextMonth.format('MMMM-YYYY');
          }
        }else {
          var myDate = moment().add(30, 'days');
          var duedate = myDate.format('DD-MM-YYYY');
          var dueDateForViewOnly = myDate.format('DD MMMM YYYY');
        }

        var spdStateForInvoice = '';
        var discomShortName = '';
        if (spdStateVar == 'Odisha' || spdStateVar == 'Gujarat' || spdStateVar == 'Maharashtra') {
            spdStateForInvoice = spdStateVar.toUpperCase();
            discomShortName = discomAddress[0].discom_short_name;
        }else if(discomVar == 'Bihar'){
          if(spdStateVar == 'North'){
            spdStateForInvoice = 'MP';
            discomShortName = 'NBPDCL';
          }else if(spdStateVar == 'South'){
            spdStateForInvoice = 'MP';
            discomShortName = 'SBPDCL';
          }
        }else if(discomVar == 'Rajasthan(APMPL)'){
            discomShortName = discomAddress[0].discom_short_name;
            spdStateForInvoice = 'RAJASTHAN';
        } else {
            discomShortName = discomAddress[0].discom_short_name;
            var checkSPDstate = Meteor.users.find({
                _id: spdDataArr[0].spd_id
            }).fetch();
            spdStateForInvoice = checkSPDstate[0].profile.registration_form.spd_state.toUpperCase();
        }
        var invoiceJson = {invoice_no:invoiceNumberVar,invoice_date:dateFormat,period:period,period_start_date:startDateOfMonth, period_end_date:endDateOfMonth,due_date:dueDateForViewOnly,particularsOfClaim:particularsOfClaim,regionalArea:regionalArea,spd_names:spdNames,spd_state:spdStateForInvoice,discom_short_name:discomShortName, invoice_data:dataJson, discom_address:addressJson,grand_total:amountInComman(grandTotal),amount_inwords:amountInWords(grandTotal)};
        var coverJson = {reference_number:referenceNumberVar,discom_address:addressJson,invoice_no:invoiceNumberVar,invoice_date:dateFormat,period:period,discom_short_name:discomShortName, spdNameArr:spdDataArr,grand_total:amountInComman(grandTotal),amount_inwords:amountInWords(grandTotal)};
        var bigArray = [];
        if(discomVar == 'Bihar'){
          var jsonToInsert = {
            reference_number: referenceNumberVar,
            invoice_number: invoiceNumberVar,
            discom_id: discomAddress[0]._id,
            discom_name: discomAddress[0].nameof_buyingutility,
            spd_direction:spdStateVar,
            discom_short_name:discomShortName,
            discom_state: discomVar,
            spd_state:spdStateForInvoice,
            energy_invoice_generation_date:dateFormatToInsert,
            energy_invoice_due_date: duedate,
            year: year,
            month: month,
            rate_per_unit:rate,
            actual_energy:provisonalEnergyVar,
            total_energy:energy_percentage,
            financial_year:financialYearVar,
            numberOfGeneration: numberOfGeneration,
            energy_data:dataJson,
            total_amount: grandTotal,
            type:'Provisional_Invoice',
            typeOfInvoice:'Provisional Invoice',
            delete_status:false,
            timestamp: new Date()
          };
        }else{
          var jsonToInsert = {
            reference_number: referenceNumberVar,
            invoice_number: invoiceNumberVar,
            discom_id: discomAddress[0]._id,
            discom_name: discomAddress[0].nameof_buyingutility,
            discom_short_name:discomShortName,
            discom_state: discomVar,
            spd_state:spdStateForInvoice,
            energy_invoice_generation_date:dateFormatToInsert,
            energy_invoice_due_date: duedate,
            year: year,
            month: month,
            rate_per_unit:rate,
            total_energy:provisonalEnergyVar,
            financial_year:financialYearVar,
            numberOfGeneration: numberOfGeneration,
            energy_data:dataJson,
            total_amount: grandTotal,
            type:'Provisional_Invoice',
            typeOfInvoice:'Provisional Invoice',
            delete_status:false,
            timestamp: new Date()
          };
        }
        bigArray.push(coverJson);
        bigArray.push(invoiceJson);
        bigArray.push(jsonToInsert);

        var random = Math.floor((Math.random() * 10000) + 1).toString();
        var TodayDateVar = moment().format('DD-MM-YYYY');
        var pdfFileName = discomVar+'_'+TodayDateVar+'_'+random;
        Meteor.call('GST_generatingRestAllProvisionalEnergyInvoicePDF',discomVar, coverJson,invoiceJson, pdfFileName);
        var path = "/upload/Invoices/InvoiceForRestAll/"+pdfFileName+".pdf";
        var pathDocx = "/upload/Invoices/InvoiceForRestAll/"+pdfFileName+".docx";
        jsonToInsert.file_path = path;
        jsonToInsert.file_path_docx = pathDocx;
        // Insert Query For RestAll Provisional Invoice
        EnergyInvoiceDetails.insert(jsonToInsert);
        var ip = this.connection.httpHeaders['x-forwarded-for'];
        var ipArr = ip.split(',');
        var logJson = {
          ip_address : ipArr,
          log_type: discomVar+' Provisional Energy Invoice Generated',
          template_name: 'generateInvoice',
          event_name: 'energyBtnView',
          state:discomVar,
          json:jsonToInsert
        }
        var invoiceLog = insertJsonForInvoiceLog(logJson);
      }
      return returnSuccess('Provisional Invoice Generated for '+discomVar+' for the month of '+month+"'"+year, path);
    },
    // Rajasthan Provisional Invoice Docx to PDF
    GST_generatingRajasthanProvisionalEnergyInvoicePDF(json,pdfFileName) {
        var fs = require('fs');
        var Docxtemplater = require('docxtemplater');
        var filepath = Assets.absoluteFilePath('RajasthanProvisionalInvoice2.docx');
        var content = fs.readFileSync(filepath, "binary");
        var doc = new Docxtemplater(content);
        doc.setData({
            'referenceNumber':json.cover_leter.reference_number,
            'invoiceDate':json.cover_leter.invoice_date,
            'invoiceRaisedTo':json.cover_leter.addressJson.invoice_raised_to,
            'discomName':json.cover_leter.addressJson.discom_name,
            'address':json.cover_leter.addressJson.address,
            'addressLineTwo':json.cover_leter.addressJson.address_line_two,
            'city':json.cover_leter.addressJson.city,
            'state':json.cover_leter.addressJson.state,
            'pin':json.cover_leter.addressJson.pin,
            'gst_number':'GST123',
            'period': json.cover_leter.period,
            'psaDate':json.cover_leter.addressJson.amendmentDate1,
            'jp_invoiceNumber' : json.jaipur_detail.invoice_number,
            'jp_invoiceDate' : json.jaipur_detail.invoice_date,
            'jp_period' : json.jaipur_detail.period,
            'jp_amount' : json.jaipur_detail.amount,
            'aj_invoiceNumber' : json.ajmer_detail.invoice_number,
            'aj_invoiceDate' : json.ajmer_detail.invoice_date,
            'aj_period' : json.ajmer_detail.period,
            'aj_amount' : json.ajmer_detail.amount,
            'jd_invoiceNumber' : json.jodhpur_detail.invoice_number,
            'jd_invoiceDate' : json.jodhpur_detail.invoice_date,
            'jd_period' : json.jodhpur_detail.period,
            'jd_amount' : json.jodhpur_detail.amount,
            'totalAmountInWrd': json.cover_leter.amount_inwords,
            'totalAmountInCom': json.cover_leter.amount,
            'authorisedSignatureName': json.cover_leter.addressJson.name,
            'authorisedSignatureDesignation': json.cover_leter.addressJson.designation,
            'designationFullForm': json.cover_leter.addressJson.full_form,
            'phone': json.cover_leter.addressJson.phone,

            'dueDate' : json.main_sheet.due_date,
            'msinvoiceNumber':json.main_sheet.invoice_number,
            'msPriodFrm':json.main_sheet.period_start_date,
            'msPriodTo':json.main_sheet.period_end_date,
            'msEnergy':json.main_sheet.energy,
            'msRate':json.main_sheet.rate,
            'msPeriod':json.main_sheet.period,
            'msAmount':json.cover_leter.amount,
            'msAmountIn':json.cover_leter.amount_inwords,
            'msJson':json.main_sheet,
            'jaipur_percent' : json.main_sheet.percentage_jaipur,
            'jaipur_energy' : json.main_sheet.energyJaipur,
            'jaipur_amount' : json.main_sheet.amountJaipur,
            'ajmer_percent' : json.main_sheet.percentage_ajmer,
            'ajmer_energy' : json.main_sheet.energyAjmer,
            'ajmer_amount' : json.main_sheet.amountAjmer,
            'jodhpur_percent' : json.main_sheet.percentage_jodhpur,
            'jodhpur_energy' : json.main_sheet.energyJodhpur,
            'jodhpur_amount' : json.main_sheet.amountJodhpur,

            'jpIndi_invoiceNumber':json.jaipur_detail.invoice_number,
            'jpIndi_energy':json.jaipur_detail.energy,
            'jpIndi_rate':json.jaipur_detail.rate,
            'jpIndi_period':json.jaipur_detail.period,
            'jpIndi_amount':json.jaipur_detail.amount,
            'jpIndi_amount_inwords':json.jaipur_detail.amount_inwords,

            'ajIndi_invoiceNumber':json.ajmer_detail.invoice_number,
            'ajIndi_energy':json.ajmer_detail.energy,
            'ajIndi_rate':json.ajmer_detail.rate,
            'ajIndi_period':json.ajmer_detail.period,
            'ajIndi_amount':json.ajmer_detail.amount,
            'ajIndi_amount_inwords':json.ajmer_detail.amount_inwords,

            'jdIndi_invoiceNumber':json.jodhpur_detail.invoice_number,
            'jdIndi_energy':json.jodhpur_detail.energy,
            'jdIndi_rate':json.jodhpur_detail.rate,
            'jdIndi_period':json.jodhpur_detail.period,
            'jdIndi_amount':json.jodhpur_detail.amount,
            'jdIndi_amount_inwords':json.jodhpur_detail.amount_inwords,
        });
        doc.render();
        var buffer = doc.getZip().generate({
            type: "nodebuffer"
        });
        fs.writeFileSync(process.env.PWD + '/.uploads/Invoices/RajasthanProvisionalInvoice/'+pdfFileName+'.docx', buffer);
        spawn = Npm.require('child_process').spawn;
        console.log("Executing post");
        command = spawn('libreoffice', ['--headless', '--convert-to', 'pdf', process.env.PWD + '/.uploads/Invoices/RajasthanProvisionalInvoice/'+pdfFileName+'.docx', '--outdir', process.env.PWD + '/.uploads/Invoices/RajasthanProvisionalInvoice']);
        command.stdout.on('data', function(data) {
            console.log('stdout: ' + data);
        });
        command.stderr.on('data', function(data) {
            console.log('stderr: ' + data);
        });
        command.on('exit', function(code) {
            console.log('child process exited with code ' + code);
        });
        // Meteor.setTimeout(function() {
        //     Meteor.call('deleteUploadedFile', process.env.PWD + '/.uploads/Invoices/RajasthanProvisionalInvoice/'+pdfFileName+'.docx');
        // }, 4000);
        console.log('Rajasthan Provisional Invoice PDF Generated');
    },
    // RestAll Provisional Invoice Docx to PDF
    GST_generatingRestAllProvisionalEnergyInvoicePDF(discomVar,coverJson,invoiceJson,pdfFileName) {
        var fs = require('fs');
        var Docxtemplater = require('docxtemplater');
        if (discomVar == 'Bihar') {
          var filepath = Assets.absoluteFilePath('BiharProvisionalInvoice.docx');
        }else {
          var filepath = Assets.absoluteFilePath('RestAllProvisionalInvoice.docx');
        }
        var content = fs.readFileSync(filepath, "binary");
        var doc = new Docxtemplater(content);

        var stringConCat = '';
        for (var i = 0; i < coverJson.spdNameArr.length; i++) {
          if (i == 0) {
            stringConCat += 'M/s '+coverJson.spdNameArr[i].spd_name
          }else if(coverJson.spdNameArr.length - 1 == i){
            stringConCat += ' & M/s '+coverJson.spdNameArr[i].spd_name
          }else {
            stringConCat += ', M/s '+coverJson.spdNameArr[i].spd_name
          }
        }
        var headerForBihar = '';
        var calCulatedPercentage = '';
        if (discomVar == 'Bihar') {
          headerForBihar = coverJson.discom_address.discom_name+'('+invoiceJson.invoice_data.percentage+'%)';
          calCulatedPercentage = invoiceJson.invoice_data.calculated_percentage;
        }

        if (discomVar == 'New Delhi') {
          var txtMsg = ' of Solar Power Project '+invoiceJson.invoice_data.spd_name;
          var txtMsg2 = 'Surcharge on delayed payment shall be applicable as per the terms and conditions of the referred agreement (PSA).';
          var particularsOfClaim = 'Invoice for sell of '+invoiceJson.particularsOfClaim;
        }else {
          var particularsOfClaim = 'Provisional Invoice for sell of '+invoiceJson.particularsOfClaim;
          if (discomVar == 'New Delhi(NTPC)') {
            var txtMsg = 'to '+coverJson.discom_short_name;
            var txtMsg2 = 'SECI is not claming any Accelerated Depreciation.';
          }else {
            var txtMsg = 'of '+stringConCat;
            var txtMsg2 = 'Surcharge on delayed payment shall be applicable as per the terms and conditions of the referred agreement (PSA).';
          }
        }
        if (discomVar == 'Rajasthan(APMPL)') {
          var transaction = 'TRANSACTION-SPD('+invoiceJson.spd_state+')-'+coverJson.discom_short_name;
          var LOIvar = 'PSA b/w SECI and '+coverJson.discom_short_name+' dated '+coverJson.discom_address.amendmentDate1;
        }else {
          var transaction = 'TRANSACTION-SPD('+invoiceJson.spd_state+')-'+invoiceJson.discom_short_name;
          var LOIvar = 'PSA b/w SECI and('+coverJson.discom_short_name+')-'+coverJson.discom_address.amendmentDate1;
        }

        if (invoiceJson.discom_address.transaction_type == 'Intra') {
          var txnData1 = invoiceJson.discom_address.user_schedule_type;
          var txnData2 = '';
        }else {
          var txnData1 = invoiceJson.discom_address.user_schedule_type;
          var txnData2 = '2. Energy Calculation Sheet at Seller Interconnection Point and Regional Peripheral'
        }

        doc.setData({
            'referenceNumber':coverJson.reference_number,
            'invoiceDate':coverJson.invoice_date,
            'invoiceRaisedTo':coverJson.discom_address.invoice_raised_to,
            'discomName':coverJson.discom_address.discom_name,
            'address':coverJson.discom_address.address,
            'addressLineTwo':coverJson.discom_address.address_line_two,
            'city':coverJson.discom_address.city,
            'state':coverJson.discom_address.state,
            'pin':coverJson.discom_address.pin,
            'gst_number':'GST123',
            'period': coverJson.period,
            'psaDate':coverJson.discom_address.amendmentDate1,
            'discomShortName':coverJson.discom_short_name,
            'txtMsg':txtMsg,
            'txtMsg2':txtMsg2,
            'txn':transaction,
            'name': coverJson.discom_address.name,
            'designation': coverJson.discom_address.designation,
            'fullForm': coverJson.discom_address.full_form,
            'phone': coverJson.discom_address.phone,
            'oneInvoiceNo' : coverJson.invoice_no,
            'oneAmtTotal' : coverJson.grand_total,
            'oneAmtInWords' : coverJson.amount_inwords,
            'particulars':particularsOfClaim,
            'headerForBihar' : headerForBihar,
            'energyPer' : calCulatedPercentage,
            'period1' : invoiceJson.period_start_date,
            'period2' : invoiceJson.period_end_date,
            'dueDate' : invoiceJson.due_date,
            'description' : 'Provisional Energy Bill '+invoiceJson.invoice_data.spd_name+' for the month of '+coverJson.period,
            'regionalArea' : invoiceJson.regionalArea,
            'energy' : invoiceJson.invoice_data.kwh,
            'rate' : invoiceJson.invoice_data.rate,
            'aount' : invoiceJson.invoice_data.amount,
            'grandTotal' : invoiceJson.grand_total,
            'grandTotalInWd' : invoiceJson.amount_inwords,
            'txnData1' : txnData1,
            'txnData2' : txnData2,
        });
        doc.render();
        var buffer = doc.getZip().generate({
            type: "nodebuffer"
        });
        fs.writeFileSync(process.env.PWD + '/.uploads/Invoices/InvoiceForRestAll/'+pdfFileName+'.docx', buffer);
        spawn = Npm.require('child_process').spawn;
        console.log("Executing post");
        command = spawn('libreoffice', ['--headless', '--convert-to', 'pdf', process.env.PWD + '/.uploads/Invoices/InvoiceForRestAll/'+pdfFileName+'.docx', '--outdir', process.env.PWD + '/.uploads/Invoices/InvoiceForRestAll']);
        command.stdout.on('data', function(data) {
            console.log('stdout: ' + data);
        });
        command.stderr.on('data', function(data) {
            console.log('stderr: ' + data);
        });
        command.on('exit', function(code) {
            console.log('child process exited with code ' + code);
        });
        // Meteor.setTimeout(function() {
        //     Meteor.call('deleteUploadedFile', process.env.PWD + '/.uploads/Invoices/InvoiceForRestAll/'+pdfFileName+'.docx');
        // }, 4000);
        console.log(discomVar+' Provisional Invoice PDF Generated');
    },
    //Gujarta provisional Invoice Generated
    GujartaProvisionalInvoice_GST(json){
      var discomAddress = Discom.find({discom_state: json.discomVar}).fetch();
      var addressJson = {
          discom_name: discomAddress[0].nameof_buyingutility,
          discom_short_name: discomAddress[0].discom_short_name,
          address: discomAddress[0].discom_address,
          address_line_two:discomAddress[0].discom_address_line_two,
          city: discomAddress[0].discom_city,
          state: discomAddress[0].discom_state,
          pin: discomAddress[0].discom_pin,
          gst_number: discomAddress[0].gst_number,
          amendmentDate1: discomAddress[0].date_of_amendment_one,
          amendmentDate2: discomAddress[0].date_of_amendment_two,
          fax: discomAddress[0].discom_fax,
          invoice_raised_to : discomAddress[0].invoice_raised_to,
          name: json.signature.name,
          designation: json.signature.designation,
          full_form:json.signature.full_form,
          phone:json.signature.phone
      };

      var dateArr = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
      var fromDateMonth = getArray(dateArr, Number(json.month));
      var period = fromDateMonth + "'" + json.year;
      var periodForInvoice = fromDateMonth.toUpperCase() + "'" + json.year;;
      var periodWithFY = fromDateMonth.toUpperCase() + "'" + json.financialYear;;

      var currentDate = new Date();
      var dateToInsert = moment(currentDate).format('DD-MM-YYYY');
      var dateToView = moment(currentDate).format("DD MMMM YYYY");
      var myDate = moment().add(30, 'days');
      var dueDateToInsert = myDate.format('DD-MM-YYYY');
      var dueDateToView = myDate.format('DD MMMM YYYY');

      var numberOfGeneration = 1;
      var checkData = EnergyInvoiceDetails.find({discom_state:json.discomVar,month:json.month,year:json.year,financial_year:json.financialYear,type:'Provisional_Invoice', delete_status:false},{sort: {$natural: -1},limit: 1}).fetch();
      if(checkData.length > 0){
        if(checkData[0].month == json.month && checkData[0].year == json.year && checkData[0].financial_year == json.financialYear){
            numberOfGeneration = (Number(checkData[0].numberOfGeneration) + Number(1));
        }
      }
      var referenceNumber = 'SECI/PS/Ph-II/B-IV/'+discomAddress[0].discom_short_name+'/'+json.year+"/"+fromDateMonth.toUpperCase()+"/"+ numberOfGeneration;
      var invNumEnergyOne = 'SECI/INTRA/'+discomAddress[0].discom_short_name+'/'+"ASTRA SOLREN/40MW"+'/'+periodWithFY+'/'+numberOfGeneration;
      var invNumEnergyTwo= 'SECI/INTRA/'+discomAddress[0].discom_short_name+'/'+"RENEW SOLAR"+'/'+periodWithFY+'/'+numberOfGeneration;
      var invNumEnergyThree= 'SECI/INTRA/'+discomAddress[0].discom_short_name+'/'+"ASTRA SOLREN/25MW"+'/'+periodWithFY+'/'+numberOfGeneration;

      var energyInvoiceRate = InvoiceCharges.find({state:json.discomVar,invoice_type:'Energy_Invoice',financial_year:json.financialYear}).fetch();
      if(energyInvoiceRate.length > 0){
        var rate = Number(energyInvoiceRate[0].rate).toFixed(2);
      }else{
        var rate = Number(1).toFixed(2);
      }

      var energyOneTotalAmt = Number(Number(json.energyOne) * rate).toFixed(2);
      var energyOneTotalAmtInComman = amountInComman(energyOneTotalAmt);
      var energyOneTotalAmtInWords = amountInWords(energyOneTotalAmt);

      var energyTwoTotalAmt = Number(Number(json.energyTwo) * rate).toFixed(2);
      var energyTwoTotalAmtInComman = amountInComman(energyTwoTotalAmt);
      var energyTwoTotalAmtInWords = amountInWords(energyTwoTotalAmt);

      var energyThreeTotalAmt = Number(json.energyThree * rate).toFixed(2);
      var energyThreeTotalAmtInComman = amountInComman(energyThreeTotalAmt);
      var energyThreeTotalAmtInWords = amountInWords(energyThreeTotalAmt);

      var totalEnergy = Number(Number(json.energyOne) + Number(json.energyTwo) + Number(json.energyThree));
      var totalAmount = Number(Number(energyOneTotalAmt) + Number(energyTwoTotalAmt) + Number(energyThreeTotalAmt)).toFixed(2);
      var totalAmountInComman = amountInComman(totalAmount);
      var totalAmountInWords = amountInWords(totalAmount);

      // getting spd id on the basis of array place
      var spdDataArr = [];
      var spdIdArr = discomAddress[0].spdIds;
      spdIdArr.forEach(function(item) {
        var getSpdData = Meteor.users.find({_id:item.spdId}).fetch();
        spdDataArr.push({spdId:item.spdId,spdName:getSpdData[0].profile.registration_form.name_of_spd,spdState:getSpdData[0].profile.registration_form.spd_state});
      });

      var spdOneJson = {invoiceNumber:invNumEnergyOne, energy:json.energyOne, spdId: spdDataArr[0].spdId, spdname:spdDataArr[0].spdName, rate:rate, period:period, total_amount:energyOneTotalAmt, amount_inword:energyOneTotalAmtInWords};
      var spdTwoJson = {invoiceNumber:invNumEnergyTwo, energy:json.energyTwo, spdId: spdDataArr[1].spdId, spdname:spdDataArr[1].spdName, rate:rate, period:period, total_amount:energyTwoTotalAmt, amount_inword:energyTwoTotalAmtInWords};
      var spdThreeJson = {invoiceNumber:invNumEnergyThree, energy:json.energyThree, spdId: spdDataArr[2].spdId, spdname:spdDataArr[2].spdName, rate:rate, period:period, total_amount:energyThreeTotalAmt, amount_inword:energyThreeTotalAmtInWords};

      var invoiceCoverJson = {
          referenceNumber:referenceNumber,
          dateToView:dateToView,
          due_date:dueDateToView,
          period:period,
          addressJson:addressJson,
          spdOneJson:spdOneJson,
          spdTwoJson:spdTwoJson,
          spdThreeJson:spdThreeJson,
          total_amount:totalAmountInComman,
          amount_inwords:totalAmountInWords
      };
      var date = moment().format('DD-MM-YYYY');
      var random = Math.floor((Math.random() * 10000) + 1).toString();
      var pdfFileName = json.discomVar+'_'+date+'_'+random;
      var filepathVar = "/upload/Invoices/InvoiceForRestAll/"+pdfFileName+'.pdf';
      var pathDocx = "/upload/Invoices/InvoiceForRestAll/"+pdfFileName+'.docx';
      Meteor.call('GST_generatingGujaratEnergyInvoicePDF',invoiceCoverJson,pdfFileName);
      var jsonToInsert = {
        reference_number: referenceNumber,
        invoice_number: referenceNumber,
        discom_id: discomAddress[0]._id,
        discom_name: discomAddress[0].nameof_buyingutility,
        discom_short_name:discomAddress[0].discom_short_name,
        discom_state: json.discomVar,
        energy_invoice_generation_date:dateToInsert,
        energy_invoice_due_date: dueDateToInsert,
        year: json.year,
        month: json.month,
        financial_year:json.financialYear,
        rate_per_unit:rate,
        total_energy:totalEnergy,
        total_amount:totalAmount,
        numberOfGeneration: numberOfGeneration,
        type:'Provisional_Invoice',
        typeOfInvoice:'Provisional Invoice',
        delete_status:false,
        spdOneJson:spdOneJson,
        spdTwoJson:spdTwoJson,
        spdThreeJson:spdThreeJson,
        // seiSitaraJson:{spdId:seiSitaraIdVar,invoice_number:invoiceNumberSEIsitara,total_energy:bifurcationOfSEAenergySitra,rate_per_unit:rate,period:period, total_amount:seiSitaraTotal},
        // seiVoltaJson : {spdId:seiVoltaIdVar,invoice_number:invoiceNumberSEIvolta, total_energy:bifurcationOfSEAenergyVolta,rate_per_unit:rate, period:period, total_amount:SEIVoltaTotal},
        // finnSuryaJson : {spdId:seiFortumIdVar,invoice_number:invoiceNumberFINNsurya,total_energy:FortumVar,rate_per_unit:rate, period:period, total_amount:FortumTotal},
        timestamp: new Date()
      };
      jsonToInsert.file_path = filepathVar;
      jsonToInsert.file_path_docx = pathDocx;
      EnergyInvoiceDetails.insert(jsonToInsert);
      var returnJson = {invoiceCoverJson:invoiceCoverJson,jsonToInsert:jsonToInsert};
      return returnSuccess('Gujarat Provisional Invoice Generating',filepathVar);
    },
    //Gujarta provisional Invoice PDF
    GST_generatingGujaratEnergyInvoicePDF(json,pdfFileName) {
        var fs = require('fs');
        var Docxtemplater = require('docxtemplater');
        var filepath = Assets.absoluteFilePath('GujaratProvisionalInvoice.docx');
        var content = fs.readFileSync(filepath, "binary");
        var doc = new Docxtemplater(content);
        doc.setData({
            'referenceNumber':json.referenceNumber,
            'invoiceRaisedTo':json.addressJson.invoice_raised_to,
            'name': json.addressJson.name,
            'designation': json.addressJson.designation,
            'full_form':json.addressJson.full_form,
            'phone':json.addressJson.phone,
            'discomName':json.addressJson.discom_name,
            'address':json.addressJson.address,
            'city':json.addressJson.city,
            'state':json.addressJson.state,
            'pin':json.addressJson.pin,
            'gst_number':json.addressJson.gst_number,
            'psaDate':json.addressJson.amendmentDate1,
            'invoiceDate' : json.dateToView,
            'dueDate' : json.due_date,
            'period': json.period,
            'totalAmountInCom': json.total_amount,
            'totalAmountInWrd': json.amount_inwords,

            'spdOneName':json.spdOneJson.spdname,
            'spdOneInvoiceNumber':json.spdOneJson.invoiceNumber,
            'spdOneEnergy':json.spdOneJson.energy,
            'spdOneRate':json.spdOneJson.rate,
            'spdOneAmount':json.spdOneJson.total_amount,
            'spdOneAmountInWrd':json.spdOneJson.amount_inword,

            'spdTwoName':json.spdTwoJson.spdname,
            'spdTwoInvoiceNumber':json.spdTwoJson.invoiceNumber,
            'spdTwoEnergy':json.spdTwoJson.energy,
            'spdTwoRate':json.spdTwoJson.rate,
            'spdTwoAmount':json.spdTwoJson.total_amount,
            'spdTwoAmountInWrd':json.spdTwoJson.amount_inword,

            'spdThreeName':json.spdThreeJson.spdname,
            'spdThreeInvoiceNumber':json.spdThreeJson.invoiceNumber,
            'spdThreeEnergy':json.spdThreeJson.energy,
            'spdThreeRate':json.spdThreeJson.rate,
            'spdThreeAmount':json.spdThreeJson.total_amount,
            'spdThreeAmountInWrd':json.spdThreeJson.amount_inword,
        });
        doc.render();
        var buffer = doc.getZip().generate({
            type: "nodebuffer"
        });
        fs.writeFileSync(process.env.PWD + '/.uploads/Invoices/InvoiceForRestAll/'+pdfFileName+'.docx', buffer);
        spawn = Npm.require('child_process').spawn;
        console.log("Executing post");
        command = spawn('libreoffice', ['--headless', '--convert-to', 'pdf', process.env.PWD + '/.uploads/Invoices/InvoiceForRestAll/'+pdfFileName+'.docx', '--outdir', process.env.PWD + '/.uploads/Invoices/InvoiceForRestAll']);
        command.stdout.on('data', function(data) {
            console.log('stdout: ' + data);
        });
        command.stderr.on('data', function(data) {
            console.log('stderr: ' + data);
        });
        command.on('exit', function(code) {
            console.log('child process exited with code ' + code);
        });
        // Meteor.setTimeout(function() {
        //     Meteor.call('deleteUploadedFile', process.env.PWD + '/.uploads/Invoices/InvoiceForRestAll/'+pdfFileName+'.docx');
        // }, 4000);
        console.log('MP Transmission Charges Payment Note PDF Generated');
    },
    //MP provisional Invoice Generated
    MPprovisionalInvoiceGeneration_GST(month,year,financialYear,discomVar,signatureJson,FortumVar,CleanSolarVar,FocalPhotovoltaicVar,JMRseiSitara,JMRseiVolta,SEAaccounting){
        var discomAddress = Discom.find({discom_state: discomVar}).fetch();
        var addressJson = {
            invoice_raised_to : discomAddress[0].invoice_raised_to,
            discom_name: discomAddress[0].nameof_buyingutility,
            discom_short_name: discomAddress[0].discom_short_name,
            address: discomAddress[0].discom_address,
            address_line_two:discomAddress[0].discom_address_line_two,
            city: discomAddress[0].discom_city,
            state: 'Madhya Pradesh',
            pin: discomAddress[0].discom_pin,
            amendmentDate1: discomAddress[0].date_of_amendment_one,
            amendmentDate2: discomAddress[0].date_of_amendment_two,
            fax: discomAddress[0].discom_fax,
            name: signatureJson.name,
            designation: signatureJson.designation,
            full_form:signatureJson.full_form,
            phone:signatureJson.phone
        };
        var dateArr = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
        var fromDateMonth = getArray(dateArr, Number(month));
        var period = fromDateMonth + "'" + year;
        var periodForInvoice = fromDateMonth.toUpperCase() + "'" + year;;

        var currentDate = new Date();
        var dateToInsert = moment(currentDate).format('DD-MM-YYYY');
        var dateToView = moment(currentDate).format("DD MMMM YYYY");
        var myDate = moment().add(30, 'days');
        var dueDateToInsert = myDate.format('DD-MM-YYYY');
        var dueDateToView = myDate.format('DD MMMM YYYY');

        var numberOfGeneration = 1;
        var checkData = EnergyInvoiceDetails.find({discom_state:discomVar,month:month,year:year,financial_year:financialYear,type:'Provisional_Invoice', delete_status:false},{sort: {$natural: -1},limit: 1}).fetch();
        if(checkData.length > 0){
          if(checkData[0].month == month && checkData[0].year == year && checkData[0].financial_year == financialYear){
              numberOfGeneration = (Number(checkData[0].numberOfGeneration) + Number(1));
          }
        }
        var referenceNumber = 'SECI/PS/'+discomAddress[0].discom_short_name+'/'+year+"/"+fromDateMonth.toUpperCase()+"/"+ numberOfGeneration;
        var invoiceNumberSEIsitara = 'SECI/INTRA/'+discomAddress[0].discom_short_name+'/'+"SEI SITARA"+'/'+periodForInvoice+'/'+numberOfGeneration;
        var invoiceNumberSEIvolta= 'SECI/INTRA/'+discomAddress[0].discom_short_name+'/'+"SEI L'VOLTA"+'/'+periodForInvoice+'/'+numberOfGeneration;
        var invoiceNumberFINNsurya= 'SECI/INTRA/'+discomAddress[0].discom_short_name+'/'+"FINNSURYA"+'/'+periodForInvoice+'/'+numberOfGeneration;
        var invoiceNumberCLEANsolar= 'SECI/INTRA/'+discomAddress[0].discom_short_name+'/'+"CLEAN SOLAR"+'/'+periodForInvoice+'/'+numberOfGeneration;
        var invoiceNumberFOCALphoto= 'SECI/INTRA/'+discomAddress[0].discom_short_name+'/'+"FOCAL PHOTO"+'/'+periodForInvoice+'/'+numberOfGeneration;

        var energyInvoiceRate = InvoiceCharges.find({state:discomVar,invoice_type:'Energy_Invoice',financial_year:financialYear}).fetch();
        if(energyInvoiceRate.length > 0){
          var rate = Number(energyInvoiceRate[0].rate).toFixed(2);
        }else{
          var rate = Number(1).toFixed(2);
        }

        var jmrTotal = Number(JMRseiSitara) + Number(JMRseiVolta);
        var plantContributionSitra = Number(Number(JMRseiSitara)/jmrTotal * 100).toFixed(6);
        var plantContributionVolta = Number(Number(JMRseiVolta)/jmrTotal * 100).toFixed(6);

        var bifurcationOfSEAenergySitra = Number(Number(SEAaccounting) * Number(plantContributionSitra) / 100).toFixed(0);
        var bifurcationOfSEAenergyVolta = Number(Number(SEAaccounting) * Number(plantContributionVolta) /100).toFixed(0);
        var bifurcationOfSEATotal = Number(bifurcationOfSEAenergySitra) + Number(bifurcationOfSEAenergyVolta);

        var sitraBifurcationJson = {jmrValue:JMRseiSitara, plantContribution:plantContributionSitra, seaAccounting:SEAaccounting, bifurcationOfSEA:bifurcationOfSEAenergySitra};
        var voltaBifurcationJson = {jmrValue:JMRseiVolta, plantContribution:plantContributionVolta, seaAccounting:SEAaccounting, bifurcationOfSEA:bifurcationOfSEAenergyVolta};
        var bifurcationJson = {sitaraJson:sitraBifurcationJson, voltaJson:voltaBifurcationJson,jmr_total:jmrTotal, bifurcationOfSEATotal:bifurcationOfSEATotal};

        var seiSitaraTotal = Number(Number(bifurcationOfSEAenergySitra) * rate).toFixed(2);
        var seiSitaraTotalInComman = amountInComman(seiSitaraTotal);
        var seiSitaraTotalInWords = amountInWords(seiSitaraTotal);

        var SEIVoltaTotal = Number(Number(bifurcationOfSEAenergyVolta) * rate).toFixed(2);
        var SEIVoltaTotalInComman = amountInComman(SEIVoltaTotal);
        var SEIVoltaTotalInWords = amountInWords(SEIVoltaTotal);

        var FortumTotal = Number(FortumVar * rate).toFixed(2);
        var FortumTotalInComman = amountInComman(FortumTotal);
        var FortumTotalInWords = amountInWords(FortumTotal);

        var CleanSolarTotal = Number(CleanSolarVar * rate).toFixed(2);
        var CleanSolarTotalInComman = amountInComman(CleanSolarTotal);
        var CleanSolarTotalInWords = amountInWords(CleanSolarTotal);

        var FocalPhotovoltaicTotal = Number(FocalPhotovoltaicVar * rate).toFixed(2);
        var FocalPhotovoltaicTotalInComman = amountInComman(FocalPhotovoltaicTotal);
        var FocalTotalInWords = amountInWords(FocalPhotovoltaicTotal);

        var totalEnergy = Number(Number(bifurcationOfSEAenergySitra) + Number(bifurcationOfSEAenergyVolta) + Number(FortumVar) + Number(CleanSolarVar) + Number(FocalPhotovoltaicVar));
        var fianlTotal = Number(Number(seiSitaraTotal) + Number(SEIVoltaTotal) + Number(FortumTotal) + Number(CleanSolarTotal) +Number(FocalPhotovoltaicTotal)).toFixed(2);
        var fianlTotalInComman = amountInComman(fianlTotal);
        var fianlTotalInWords = amountInWords(fianlTotal);
        // getting spd id on the basis of array place
        var seiFocalIdVar = discomAddress[0].spdIds[0].spdId;
        var seiCleanDharIdVar = discomAddress[0].spdIds[3].spdId;
        var seiFortumIdVar = discomAddress[0].spdIds[4].spdId;
        var seiSitaraIdVar = discomAddress[0].spdIds[5].spdId;
        var seiVoltaIdVar = discomAddress[0].spdIds[6].spdId;

        var seiSitaraJson = {invoiceNumber:invoiceNumberSEIsitara, energy:bifurcationOfSEAenergySitra, spdname:'SEI Sitara Pvt. Ltd.', rate:rate, period:period, total_amount:seiSitaraTotalInComman, amount_inword:seiSitaraTotalInWords};
        var seiVoltaJson = {invoiceNumber:invoiceNumberSEIvolta, energy:bifurcationOfSEAenergyVolta, spdname:"SEI L'Volta Pvt. Ltd.", rate:rate, period:period, total_amount:SEIVoltaTotalInComman, amount_inword:SEIVoltaTotalInWords};
        var finnSuryaJson = {invoiceNumber:invoiceNumberFINNsurya, energy:FortumVar, spdname:'Fortum FinnSurya Energy Pvt. Ltd.', rate:rate, period:period, total_amount:FortumTotalInComman, amount_inword:FortumTotalInWords};
        var cleanSolarJson = {invoiceNumber:invoiceNumberCLEANsolar, energy:CleanSolarVar, spdname:'Clean Solar Power (Dhar) Pvt. LTd.', rate:rate, period:period, total_amount:CleanSolarTotalInComman, amount_inword:CleanSolarTotalInWords};
        var focalPhotoJson = {invoiceNumber:invoiceNumberFOCALphoto, energy:FocalPhotovoltaicVar, spdname:'Focal Photovoltaic India Pvt. Ltd.', rate:rate, period:period, total_amount:FocalPhotovoltaicTotalInComman, amount_inword:FocalTotalInWords};

        var invoiceCoverJson = {
            referenceNumber:referenceNumber,
            dateToView:dateToView,
            due_date:dueDateToView,
            period:period,
            addressJson:addressJson,
            seiSitaraJson:seiSitaraJson,
            seiVoltaJson:seiVoltaJson,
            finnSuryaJson:finnSuryaJson,
            cleanSolarJson:cleanSolarJson,
            focalPhotoJson:focalPhotoJson,
            bifurcationJson:bifurcationJson,
            total_amount:fianlTotalInComman,
            amount_inwords:fianlTotalInWords
        };
        var jsonToInsert = {
          reference_number: referenceNumber,
          invoice_number: referenceNumber,
          discom_id: discomAddress[0]._id,
          discom_name: discomAddress[0].nameof_buyingutility,
          discom_short_name:discomAddress[0].discom_short_name,
          discom_state: discomVar,
          energy_invoice_generation_date:dateToInsert,
          energy_invoice_due_date: dueDateToInsert,
          year: year,
          month: month,
          financial_year:financialYear,
          rate_per_unit:rate,
          total_energy:totalEnergy,
          total_amount:fianlTotal,
          numberOfGeneration: numberOfGeneration,
          type:'Provisional_Invoice',
          typeOfInvoice:'Provisional Invoice',
          delete_status:false,
          seiSitaraJson:{spdId:seiSitaraIdVar,invoice_number:invoiceNumberSEIsitara,total_energy:bifurcationOfSEAenergySitra,rate_per_unit:rate,period:period, total_amount:seiSitaraTotal},
          seiVoltaJson : {spdId:seiVoltaIdVar,invoice_number:invoiceNumberSEIvolta, total_energy:bifurcationOfSEAenergyVolta,rate_per_unit:rate, period:period, total_amount:SEIVoltaTotal},
          finnSuryaJson : {spdId:seiFortumIdVar,invoice_number:invoiceNumberFINNsurya,total_energy:FortumVar,rate_per_unit:rate, period:period, total_amount:FortumTotal},
          cleanSolarJson : {spdId:seiCleanDharIdVar,invoice_number:invoiceNumberCLEANsolar, total_energy:CleanSolarVar, rate_per_unit:rate, period:period, total_amount:CleanSolarTotal},
          focalPhotoJson : {spdId:seiFocalIdVar,invoice_number:invoiceNumberFOCALphoto, total_energy:FocalPhotovoltaicVar,rate_per_unit:rate, period:period, total_amount:FocalPhotovoltaicTotal},
          timestamp: new Date()
        };
        var returnJson = {invoiceCoverJson:invoiceCoverJson,jsonToInsert:jsonToInsert};

        var TodayDateVar = moment().format('DD-MM-YYYY');
        var random = Math.floor((Math.random() * 10000) + 1).toString();
        var pdfFileName = 'MP_Provisional_'+'_'+TodayDateVar+'_'+random;
        Meteor.call('GST_generatingMPProvisionalEnergyInvoicePDF',invoiceCoverJson, pdfFileName);
        var path = "/upload/Invoices/InvoiceForRestAll/"+pdfFileName+".pdf";
        var pathDocx = "/upload/Invoices/InvoiceForRestAll/"+pdfFileName+".docx";
        jsonToInsert.file_path = path;
        jsonToInsert.file_path_docx = pathDocx;
        // Insert Query For Rajasthan Provisional Invoice
        EnergyInvoiceDetails.insert(jsonToInsert);
        var ip = this.connection.httpHeaders['x-forwarded-for'];
        var ipArr = ip.split(',');
        var logJson = {
          ip_address : ipArr,
          log_type: 'MP Provisional Energy Invoice Generated',
          template_name: 'generateInvoice',
          event_name: 'energyBtnView',
          state:discomVar,
          json:jsonToInsert
        }
        // Send Json To insert Log Details by using insertJsonForInvoiceLog method
        var invoiceLog = insertJsonForInvoiceLog(logJson);
        return returnSuccess('Provisional Invoice Generated for '+discomVar+' for the month of '+month+"'"+year, path);
    },
    // RestAll Provisional Invoice Docx to PDF
    GST_generatingMPProvisionalEnergyInvoicePDF(json, pdfFileName) {
        var fs = require('fs');
        var Docxtemplater = require('docxtemplater');
        var filepath = Assets.absoluteFilePath('MpProvisionalnvoice2.docx');
        var content = fs.readFileSync(filepath, "binary");
        var doc = new Docxtemplater(content);
        doc.setData({
          'referenceNumber':json.referenceNumber,
          'invoiceDate':json.dateToView,
          'invoiceRaisedTo':json.addressJson.invoice_raised_to,
          'name': json.addressJson.name,
          'designation': json.addressJson.designation,
          'fullForm': json.addressJson.full_form,
          'phone': json.addressJson.phone,
          'discomName':json.addressJson.discom_name,
          'address':json.addressJson.address,
          'addressLineTwo':json.addressJson.address_line_two,
          'city':json.addressJson.city,
          'state':json.addressJson.state,
          'pin':json.addressJson.pin,
          'gst_number':'GST123',
          'period': json.period,
          'dueDate' : json.due_date,
          'psaDate':json.addressJson.amendmentDate1,
          'psaDate2':json.addressJson.amendmentDate2,
          'discomShortName':json.addressJson.discom_short_name,
          'sitaraInvNum' : json.seiSitaraJson.invoiceNumber,
          'sitaraEnergy' : json.seiSitaraJson.energy,
          'sitaraRate' : json.seiSitaraJson.rate,
          'sitaraTotalAmt' : json.seiSitaraJson.total_amount,
          'sitaraTotalAmtInWords' : json.seiSitaraJson.amount_inword,
          'voltaInvNum' : json.seiVoltaJson.invoiceNumber,
          'voltaEnergy' : json.seiVoltaJson.energy,
          'voltaRate' : json.seiVoltaJson.rate,
          'voltaTotalAmt' : json.seiVoltaJson.total_amount,
          'voltaTotalAmtInWords' : json.seiVoltaJson.amount_inword,
          'finnSuryaInvNum' : json.finnSuryaJson.invoiceNumber,
          'finnSuryaEnergy' : json.finnSuryaJson.energy,
          'finnSuryaRate' : json.finnSuryaJson.rate,
          'finnSuryaTotalAmt' : json.finnSuryaJson.total_amount,
          'finnSuryaTotalAmtInWords' : json.finnSuryaJson.amount_inword,
          'cleanInvNum' : json.cleanSolarJson.invoiceNumber,
          'cleanEnergy' : json.cleanSolarJson.energy,
          'cleanRate' : json.cleanSolarJson.rate,
          'cleanTotalAmt' : json.cleanSolarJson.total_amount,
          'cleanTotalAmtInWords' : json.cleanSolarJson.amount_inword,
          'focalInvNum' : json.focalPhotoJson.invoiceNumber,
          'focalEnergy' : json.focalPhotoJson.energy,
          'focalRate' : json.focalPhotoJson.rate,
          'focalTotalAmt' : json.focalPhotoJson.total_amount,
          'focalTotalAmtInWords' : json.focalPhotoJson.amount_inword,
          'grandTotal' : json.total_amount,
          'grandTotalInWords' : json.amount_inwords,
          'sitaraJmr' : json.bifurcationJson.sitaraJson.jmrValue,
          'sitaraPC' : json.bifurcationJson.sitaraJson.plantContribution,
          'sitaraAC' : json.bifurcationJson.sitaraJson.seaAccounting,
          'sitaraBifurcationOfSEA' : json.bifurcationJson.sitaraJson.bifurcationOfSEA,
          'voltaJmr' : json.bifurcationJson.voltaJson.jmrValue,
          'voltaPC' : json.bifurcationJson.voltaJson.plantContribution,
          'voltaBifurcationOfSEA' : json.bifurcationJson.voltaJson.bifurcationOfSEA,
          'totalJmr' : json.bifurcationJson.jmr_total,
          'bifurcationOfSEATotal' : json.bifurcationJson.bifurcationOfSEATotal,
        });
        doc.render();
        var buffer = doc.getZip().generate({
            type: "nodebuffer"
        });
        fs.writeFileSync(process.env.PWD + '/.uploads/Invoices/InvoiceForRestAll/'+pdfFileName+'.docx', buffer);
        spawn = Npm.require('child_process').spawn;
        console.log("Executing post");
        command = spawn('libreoffice', ['--headless', '--convert-to', 'pdf', process.env.PWD + '/.uploads/Invoices/InvoiceForRestAll/'+pdfFileName+'.docx', '--outdir', process.env.PWD + '/.uploads/Invoices/InvoiceForRestAll']);
        command.stdout.on('data', function(data) {
            console.log('stdout: ' + data);
        });
        command.stderr.on('data', function(data) {
            console.log('stderr: ' + data);
        });
        command.on('exit', function(code) {
            console.log('child process exited with code ' + code);
        });
        // Meteor.setTimeout(function() {
        //     Meteor.call('deleteUploadedFile', process.env.PWD + '/.uploads/Invoices/InvoiceForRestAll/'+pdfFileName+'.docx');
        // }, 4000);
        console.log('MP Provisional Invoice PDF Generated');
    },
    // using for credit debit note
    ViewEnergyInvoiceDataForCreditDebitNote_GST: function(month, year, discomVar, stuLossVar, annexureDataArr, JaipurPreviousSellEnergyVar, AjmerPreviousSellEnergyVar, JodhpurPreviousSellEnergyVar,financialYear,signatureJson,totalProvisionalVar) {
        var i = 0;
        var returnAllDataArr = [];
        var AnnexureOneDataArr = [];
        var totalArr = [];
        var totalRealBeforeLoss = 0;
        var totalRealAfterLoss = 0;
        var discomAddress = Discom.find({
            discom_state: discomVar
        }).fetch();
        // geting address as well as discom name
        var addressJson = {
            invoice_raised_to : discomAddress[0].invoice_raised_to,
            discom_name: discomAddress[0].nameof_buyingutility,
            address: discomAddress[0].discom_address,
            address_line_two:discomAddress[0].discom_address_line_two,
            city: discomAddress[0].discom_city,
            state: discomAddress[0].discom_state,
            pin: discomAddress[0].discom_pin,
            amendmentDate1: discomAddress[0].date_of_amendment_one,
            amendmentDate2: discomAddress[0].date_of_amendment_two,
            fax: discomAddress[0].discom_fax,
            name: signatureJson.name,
            designation: signatureJson.designation,
            full_form:signatureJson.full_form,
            phone:signatureJson.phone
        };
        var date = new Date();
        var dateArr = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
        var fromDateMonth = getArray(dateArr, Number(month));
        var period = fromDateMonth + "'" + year;
        var annexureTwoVar = BillingrReports.find({
            month: month,
            year: year,
            spdState: discomVar
        }).fetch();

        if (annexureTwoVar.length > 0) {
            annexureTwoVar.forEach(function(item) {
                i++;
                if (_.isArray(item.aryTotal)) {
                  var reaValue = Number(Number(item.aryTotal[0]) * 1000000).toFixed(2);
                }else{
                  var reaValue = Number(Number(item.aryTotal) * 1000000).toFixed(2);
                }
                if (_.isArray(item.lossTotal)) {
                  var afterLoss = Number(Number(item.lossTotal[0]) * 1000000).toFixed(2);
                }else{
                  var afterLoss = Number(Number(item.lossTotal) * 1000000).toFixed(2);
                }
                totalRealBeforeLoss += Number(reaValue);
                totalRealAfterLoss += Number(afterLoss);
                AnnexureOneDataArr.push({
                    sn: i,
                    short_name: item.discomShortName,
                    rea_befor_loss: reaValue,
                    stu_loss: stuLossVar,
                    rea_after_loss: Number(afterLoss).toFixed(2)
                });
            });
        }
        totalArr.push({
            period: period,
            totalRealBeforeLoss: Number(totalRealBeforeLoss).toFixed(2),
            totalRealAfterLoss: Number(totalRealAfterLoss).toFixed(2)
        });
        returnAllDataArr.push(AnnexureOneDataArr);
        returnAllDataArr.push(totalArr);
        // calculation for annexure One
        //converted month as a string because Vidu inserted month in JMR as an string
        var spdDataArr = [];
        var discomDataArr = [];
        var i = 0;
        var spdTotalEnergy_A = 0;
        var spdTotalAmount_A = 0;
        var discomTotalEnergy_B = 0;
        var discomTotalAmount_B = 0;
        //finding first and last date of selected month
        var date = new Date(year, Number(month) - 1, 1);
        var dateArr = [];
        while (date.getMonth() == Number(month) - 1) {
            var update = date.getDate() + "-" + Number(month) + "-" + Number(year);
            var newDate = update.split("-");
            var myObject = new Date(newDate[2], newDate[1] - 1, newDate[0]);
            dateArr.push(myObject);
            date.setDate(date.getDate() + 1);
        }
        var firstDate = dateArr[0];
        var lastDate = dateArr[Number(dateArr.length - 1)];
        var startDateOfMonth = moment(firstDate).format("DD MMMM YYYY");
        var startDateOfMonthToInsert = moment(firstDate).format("DD-MM-YYYY");
        var endDateOfMonth = moment(lastDate).format("DD MMMM YYYY");
        var endDateOfMonthToInsert = moment(lastDate).format("DD-MM-YYYY");
        var energyInvoiceRate = InvoiceCharges.find({state:discomVar,invoice_type:'Energy_Invoice',financial_year:financialYear}).fetch();
        if(energyInvoiceRate.length > 0){
          var rate = Number(energyInvoiceRate[0].rate);
        }else{
          var rate = 1;
        }
        //calculating JMR energy on the basis of  SPD and make json and push in array
        annexureDataArr.forEach(function(item) {
            i++;
            spdDataArr.push({
                sn: i,
                spd_nane: item.name,
                energy: item.energy,
                rate: rate.toFixed(2),
                amount: (Number(item.energy) * rate).toFixed(2)
            });
            spdTotalEnergy_A += Number(item.energy);
            spdTotalAmount_A += Number(item.energy) * rate;
        });
        var j = 0;
        //calculating REA energy on the basis of  discom and make json and push in array
        AnnexureOneDataArr.forEach(function(item) {
            j++;
            discomDataArr.push({
                sn: j,
                short_name: item.short_name,
                rea_befor_loss: item.rea_befor_loss,
                rate: rate.toFixed(2),
                amount: (Number(item.rea_befor_loss) * rate).toFixed(2)
            });
            discomTotalEnergy_B += Number(item.rea_befor_loss);
            discomTotalAmount_B += Number(item.rea_befor_loss) * rate;
        });
        var balanceAbsorbedEnergy = Number(spdTotalEnergy_A) - Number(discomTotalEnergy_B);
        var checkTxnType = Number(balanceAbsorbedEnergy) - Number(totalProvisionalVar);
        if (checkTxnType < 0) {
          var transactionType = 'Credit';
        }else if (checkTxnType > 0) {
          var transactionType = 'Debit';
        }
        TemporaryInvoice.update(
           { month:month,year:year,discom_state:discomVar,type:transactionType,financial_year:financialYear},
           {
             month:month,
             year:year,
             discom_state:discomVar,
             stu_loss:stuLossVar,
             jaipurPreviousEnergy:JaipurPreviousSellEnergyVar,
             ajmerPreviousEnergy:AjmerPreviousSellEnergyVar,
             jodhpurPreviousEnergy:JodhpurPreviousSellEnergyVar,
             type:transactionType,
             financial_year:financialYear,
             data :annexureDataArr,
             signature:signatureJson,
             timestamp: new Date()
           },
           { upsert: true }
        );
        var balanceAbsorbedAmount = Number(spdTotalAmount_A) - Number(discomTotalAmount_B);
        // using for invoice number and reference number of note
        var type = '';
        var referenceNumber = '';
        var numberOfGeneration = 1;
        var CDcount = 1;
        var currentDate = new Date();
        var dateFormat = moment(currentDate).format("DD MMMM YYYY");
        var dateFormatToInsert = moment(currentDate).format('DD-MM-YYYY');
        var myDate = moment().add(30, 'days');
        var duedate = myDate.format('DD-MM-YYYY');
        var dueDateForViewOnly = myDate.format("DD MMMM YYYY");
        var checkData = EnergyInvoiceDetails.find({discom_state:discomVar,month:month,year:year,financial_year:financialYear,type:transactionType, delete_status:false},{sort: {$natural: -1},limit: 1}).fetch();
        if(checkData.length > 0){
          if(checkData[0].month == month && checkData[0].year == year && checkData[0].financial_year == financialYear){
              numberOfGeneration = Number(checkData[0].numberOfGeneration + 1);
              if(checkData[0].jaipur_discom.count){
                CDcount = Number(checkData[0].jaipur_discom.count + 1);
              }
          }
        }
        referenceNumber = 'SECI/PS/JNNSM-750RUVNL/'+year+"/"+fromDateMonth+"/"+ numberOfGeneration;
        // calculation for credit Note for jaipur disco
        //Percentage for jaipur discom
        var grnadTotalJaipur = 0;
        var grnadTotalJaipurEnergy = 0;
        var EnergyPercentageJaipur = (Number(balanceAbsorbedEnergy) * 40) / 100;
        var AmountPercentageJaipur = (Number(balanceAbsorbedAmount) * 40) / 100;
        var jaipurDiscom = {
            jaipur_percentage: '40%',
            jaipur_energy: EnergyPercentageJaipur.toFixed(2),
            jaipur_amount: amountInComman(AmountPercentageJaipur.toFixed(2))
        };
        var transaction_type_small = '';
        var transaction_type_fullCap = '';
        var previousAmountJaipur = (rate * JaipurPreviousSellEnergyVar).toFixed(2);
        if(transactionType == 'Credit'){
          grnadTotalJaipurEnergy = Number(EnergyPercentageJaipur - JaipurPreviousSellEnergyVar).toFixed(2);
          grnadTotalJaipur = Number(AmountPercentageJaipur - previousAmountJaipur).toFixed(2);
          type = 'C';
          transaction_type_small = 'credit';
          transaction_type_fullCap = 'CREDIT';
        }else{
          grnadTotalJaipurEnergy = Number(EnergyPercentageJaipur - JaipurPreviousSellEnergyVar).toFixed(2);
          grnadTotalJaipur = (Number(AmountPercentageJaipur) - Number(previousAmountJaipur)).toFixed(2);
          type = 'D';
          transaction_type_small = 'debit';
          transaction_type_fullCap = 'DEBIT';
        }
        var creditDebitNoteNumJAIPUR = CDcount+''+type;
        var invoiceNumberJaipur = 'SECI/INTRA/RAJASTHAN/JAIPUR DISCOM/'+year+'/'+fromDateMonth+'/'+numberOfGeneration;
        var jaipurDiscomNote = {date:dateFormat,invoice:creditDebitNoteNumJAIPUR,count:CDcount,invoiceNumberJaipur:invoiceNumberJaipur,current_energy:EnergyPercentageJaipur.toFixed(2),previous_energy:JaipurPreviousSellEnergyVar,rate:Number(rate).toFixed(2),period:period,current_amount:amountInComman(AmountPercentageJaipur.toFixed(2)),previous_amount:amountInComman(previousAmountJaipur), grand_total:amountInComman(grnadTotalJaipur), amount_inwords: amountInWords(grnadTotalJaipur)};

        // this code is calculating data for ajmer DISCOM
        // Percentage for ajmer discom
        var grnadTotalAjmer = 0;
        var grnadTotalAjmerEnergy = 0;
        var EnergyPercentageAjmer = (Number(balanceAbsorbedEnergy) * 28) / 100;
        var AmountPercentageAjmer = (Number(balanceAbsorbedAmount) * 28) / 100;
        var ajmerDiscom = {
            ajmer_percentage: '28%',
            ajmer_energy: EnergyPercentageAjmer.toFixed(2),
            ajmer_amount: amountInComman(AmountPercentageAjmer.toFixed(2))
        };
        var previousAmountAjmer = (rate * AjmerPreviousSellEnergyVar).toFixed(2);
        if(transactionType == 'Credit'){
          grnadTotalAjmerEnergy = Number(EnergyPercentageAjmer - AjmerPreviousSellEnergyVar).toFixed(2);
          grnadTotalAjmer = Number(AmountPercentageAjmer - previousAmountAjmer).toFixed(2);
          type = 'C';
        }else{
          grnadTotalAjmerEnergy = Number(EnergyPercentageAjmer - AjmerPreviousSellEnergyVar).toFixed(2);
          grnadTotalAjmer = (Number(AmountPercentageAjmer) - Number(previousAmountAjmer)).toFixed(2);
          type = 'D';
        }
        var creditDebitNoteNumAJMER = Number(CDcount + 1)+''+type;
        var invoiceNumberAjmer = 'SECI/INTRA/RAJASTHAN/AJMER DISCOM/'+year+'/'+fromDateMonth+'/'+numberOfGeneration;
        var ajmerDiscomNote = {date:dateFormat,invoice:creditDebitNoteNumAJMER,count:Number(CDcount + 1),invoiceNumberAjmer:invoiceNumberAjmer,current_energy:EnergyPercentageAjmer.toFixed(2),previous_energy:AjmerPreviousSellEnergyVar,rate:Number(rate).toFixed(2),period:period,current_amount:amountInComman(AmountPercentageAjmer.toFixed(2)),previous_amount:amountInComman(previousAmountAjmer), grand_total:amountInComman(grnadTotalAjmer), amount_inwords: amountInWords(grnadTotalAjmer)};

        // this code is calculating data for jodhpur DISCOM
        // Percentage for jodhpur discom
        var grnadTotalJodhpur = 0;
        var grnadTotalJodhpurEnergy = 0;
        var EnergyPercentageJodhpur = (Number(balanceAbsorbedEnergy) * 32) / 100;
        var AmountPercentageJodhpur = (Number(balanceAbsorbedAmount) * 32) / 100;
        var jodhpurDiscom = {
            jodhpur_percentage: '32%',
            jodhpur_energy: EnergyPercentageJodhpur.toFixed(2),
            jodhpur_amount: amountInComman(AmountPercentageJodhpur.toFixed(2))
        };
        var previousAmountJodhpur = (rate * JodhpurPreviousSellEnergyVar).toFixed(2);
        if(transactionType == 'Credit'){
          grnadTotalJodhpurEnergy = Number(EnergyPercentageJodhpur - JodhpurPreviousSellEnergyVar).toFixed(2);
          grnadTotalJodhpur = Number(AmountPercentageJodhpur - previousAmountJodhpur).toFixed(2);
          type = 'C';
        }else{
          grnadTotalJodhpurEnergy = Number(EnergyPercentageJodhpur - JodhpurPreviousSellEnergyVar).toFixed(2);
          grnadTotalJodhpur = (Number(AmountPercentageJodhpur) - Number(previousAmountJodhpur)).toFixed(2);
          type = 'D';
        }
        var creditDebitNoteNumJODHPUR = Number(CDcount + 2)+''+type;
        var invoiceNumberJodhpur = 'SECI/INTRA/RAJASTHAN/JODHPUR DISCOM/'+year+'/'+fromDateMonth+'/'+numberOfGeneration;
        var jodhpurDiscomNote = {date:dateFormat,invoice:creditDebitNoteNumJODHPUR,count:Number(CDcount + 2),invoiceNumberJodhpur:invoiceNumberJodhpur,current_energy:EnergyPercentageJodhpur.toFixed(2),previous_energy:JodhpurPreviousSellEnergyVar,rate:Number(rate).toFixed(2),period:period,current_amount:amountInComman(AmountPercentageJodhpur.toFixed(2)),previous_amount:amountInComman(previousAmountJodhpur), grand_total:amountInComman(grnadTotalJodhpur),amount_inwords: amountInWords(grnadTotalJodhpur)};

        // final total which is shown in cover letter
        var grendTotalEnergyForAll = (Number(grnadTotalJaipurEnergy) + Number(grnadTotalAjmerEnergy) + Number(grnadTotalJodhpurEnergy)).toFixed(2);
        var grnadTotalForAll = (Number(grnadTotalJaipur) + Number(grnadTotalAjmer) + Number(grnadTotalJodhpur)).toFixed(2);
        var jsonForIndividualData = {addressJson:addressJson,transaction_type_fullCap:transaction_type_fullCap,transaction_type_small:transaction_type_small,transaction_type_capital:transactionType,dueDateForViewOnly:dueDateForViewOnly,referenceNumber:referenceNumber,jaipurDiscomNote:jaipurDiscomNote,ajmerDiscomNote:ajmerDiscomNote,jodhpurDiscomNote:jodhpurDiscomNote,grnadTotalForAll:amountInComman(grnadTotalForAll), amount_inwords: amountInWords(grnadTotalForAll)};
        // final json----
        var InvoiceTypeVar = transactionType+' Note';
        var AnnexureTwoDataJson = {
            start_month: startDateOfMonth,
            end_month: endDateOfMonth,
            financial_year:financialYear,
            spdData: spdDataArr,
            spd_total_energy_A: spdTotalEnergy_A.toFixed(2),
            spd_total_amount_A: amountInComman(spdTotalAmount_A.toFixed(2)),
            discomData: discomDataArr,
            discom_total_energy_B: discomTotalEnergy_B.toFixed(2),
            discom_total_amount_B: amountInComman(discomTotalAmount_B.toFixed(2)),
            total_energy: balanceAbsorbedEnergy.toFixed(0),
            total_amount: amountInComman(balanceAbsorbedAmount.toFixed(2)),
            amount_inwords: amountInWords(balanceAbsorbedAmount.toFixed(2)),
            jaipurDiscom: jaipurDiscom,
            ajmerDiscom: ajmerDiscom,
            jodhpurDiscom: jodhpurDiscom
        };
        var jsonToInsert = {
          reference_number: referenceNumber,
          discom_id: discomAddress[0]._id,
          discom_name: discomAddress[0].nameof_buyingutility,
          discom_short_name:discomAddress[0].discom_short_name,
          discom_state: discomVar,
          energy_invoice_generation_date:dateFormatToInsert,
          energy_invoice_due_date: duedate,
          month: month,
          year: year,
          financial_year:financialYear,
          rate_per_unit:rate,
          stu_loss:stuLossVar,
          total_energy:grendTotalEnergyForAll,
          total_amount: grnadTotalForAll,
          numberOfGeneration: numberOfGeneration,
          type:transactionType,
          typeOfInvoice:InvoiceTypeVar,
          delete_status:false,
          timestamp:new Date(),
          // jaipur discom json
          jaipur_discom:{
            count:CDcount,
            credit_debit_note_no:creditDebitNoteNumJAIPUR,
            reference_number: referenceNumber,
            invoice_number:invoiceNumberJaipur,
            discom_name:'JAIPUR DISCOM',
            discom_state: discomVar,
            energy_invoice_generation_date:dateFormatToInsert,
            energy_invoice_due_date: duedate,
            month: month,
            year: year,
            financial_year:financialYear,
            rate_per_unit:rate,
            provisional_total_energy:JaipurPreviousSellEnergyVar,
            provisional_total_amount:previousAmountJaipur,
            actual_energy:EnergyPercentageJaipur.toFixed(2),
            actual_amount:Number(AmountPercentageJaipur).toFixed(2),
            total_energy:grnadTotalJaipurEnergy,
            total_amount:grnadTotalJaipur,
            period:period,
            type:transactionType,
            typeOfInvoice:InvoiceTypeVar,
            timestamp:new Date()
          },
          // ajmer discom json
          ajmer_discom:{
            count:Number(CDcount + 1),
            credit_debit_note_no:creditDebitNoteNumAJMER,
            reference_number: referenceNumber,
            invoice_number:invoiceNumberAjmer,
            discom_name:'AJMER DISCOM',
            discom_state: discomVar,
            energy_invoice_generation_date:dateFormatToInsert,
            energy_invoice_due_date: duedate,
            month: month,
            year: year,
            financial_year:financialYear,
            rate_per_unit:rate,
            provisional_total_energy:AjmerPreviousSellEnergyVar,
            provisional_total_amount:previousAmountAjmer,
            actual_energy:EnergyPercentageAjmer.toFixed(2),
            actual_amount:Number(AmountPercentageAjmer).toFixed(2),
            total_energy:grnadTotalAjmerEnergy,
            total_amount:grnadTotalAjmer,
            period:period,
            type:transactionType,
            typeOfInvoice:InvoiceTypeVar,
            timestamp:new Date()
          },
          // jodhpur discom json
          jodhpur_discom:{
            count:Number(CDcount + 2),
            credit_debit_note_no:creditDebitNoteNumJODHPUR,
            reference_number: referenceNumber,
            invoice_number:invoiceNumberJodhpur,
            discom_name:'JODHPUR DISCOM',
            discom_state: discomVar,
            energy_invoice_generation_date:dateFormatToInsert,
            energy_invoice_due_date: duedate,
            month: month,
            year: year,
            financial_year:financialYear,
            rate_per_unit:rate,
            provisional_total_energy:JodhpurPreviousSellEnergyVar,
            provisional_total_amount:previousAmountJodhpur,
            actual_energy:EnergyPercentageJodhpur.toFixed(2),
            actual_amount:Number(AmountPercentageJodhpur).toFixed(2),
            total_energy:grnadTotalJodhpurEnergy,
            total_amount:grnadTotalJodhpur,
            period:period,
            type:transactionType,
            typeOfInvoice:InvoiceTypeVar,
            timestamp:new Date()
          },
          // annexure one json
          annexureOneDataArr:AnnexureOneDataArr,
          // annexure two json
          annexureTwoDataJson:{
              start_month: startDateOfMonthToInsert,
              end_month: endDateOfMonthToInsert,
              month: month,
              year: year,
              financial_year:financialYear,
              spdData: spdDataArr,
              spd_total_energy_A: Number(spdTotalEnergy_A).toFixed(2),
              spd_total_amount_A: Number(spdTotalAmount_A).toFixed(2),
              discomData: discomDataArr,
              discom_total_energy_B: Number(discomTotalEnergy_B).toFixed(2),
              discom_total_amount_B: Number(discomTotalAmount_B).toFixed(2),
              total_energy: Number(balanceAbsorbedEnergy).toFixed(0),
              total_amount: Number(balanceAbsorbedAmount).toFixed(2),
              amount_inwords: Number(balanceAbsorbedAmount).toFixed(2),
              jaipur_discom: {jaipur_percentage: '40%',jaipur_energy: Number(EnergyPercentageJaipur).toFixed(2),jaipur_amount: Number(AmountPercentageJaipur).toFixed(2)},
              ajmer_discom: {ajmer_percentage: '28%',ajmer_energy: Number(EnergyPercentageAjmer).toFixed(2),ajmer_amount: Number(AmountPercentageAjmer).toFixed(2)},
              jodhpur_discom: {jodhpur_percentage: '32%',jodhpur_energy: Number(EnergyPercentageJodhpur).toFixed(2),jodhpur_amount: Number(AmountPercentageJodhpur).toFixed(2)}
          },
        };
        returnAllDataArr.push(AnnexureTwoDataJson);
        returnAllDataArr.push(jsonForIndividualData);
        returnAllDataArr.push(jsonToInsert);
        returnAllDataArr.push(transactionType);

        var TodayDateVar = moment().format('DD-MM-YYYY');
        var random = Math.floor((Math.random() * 10000) + 1).toString();
        var pdfFileName = 'Rajasthan_'+transactionType+'_Note_'+TodayDateVar+'_'+random;
        Meteor.call('GST_generatingRajasthanCreditDebitNotePDF',transactionType, jsonForIndividualData, AnnexureOneDataArr, AnnexureTwoDataJson, totalArr, pdfFileName);
        var path = "/upload/Invoices/RajasthanCreditDebitNote/"+pdfFileName+".pdf";
        var pathDocx = "/upload/Invoices/RajasthanCreditDebitNote/"+pdfFileName+".docx";
        jsonToInsert.file_path = path;
        jsonToInsert.file_path_docx = pathDocx;
        // Insert Query For Rajasthan Provisional Invoice
        EnergyInvoiceDetails.insert(jsonToInsert);
        var ip = this.connection.httpHeaders['x-forwarded-for'];
        var ipArr = ip.split(',');
        var logJson = {
        ip_address : ipArr,
        log_type: 'Rajasthan Credit/Debit Note Generated',
        template_name: 'generateInvoice',
        event_name: 'energyBtnView',
        state:discomVar,
        json:jsonToInsert
        }
        // Send Json To insert Log Details by using insertJsonForInvoiceLog method
        var invoiceLog = insertJsonForInvoiceLog(logJson);
        return returnSuccess(discomVar+' '+transactionType+' Note Generated for the month of '+month+"'"+year, path);
    },
    // Rajasthan Credit Debit Note Docx to PDF
    GST_generatingRajasthanCreditDebitNotePDF(transactionType, json, AnnexureOneDataArr, AnnexureTwoDataJson, totalArr, pdfFileName) {
        var fs = require('fs');
        var Docxtemplater = require('docxtemplater');
        if (transactionType == 'Credit') {
          var filepath = Assets.absoluteFilePath('RajasthanCreditNoteInvoice.docx');
        }else {
          var filepath = Assets.absoluteFilePath('RajasthanCreditNoteInvoice.docx');
        }
        var content = fs.readFileSync(filepath, "binary");
        var doc = new Docxtemplater(content);
        doc.setData({
          'referenceNumber':json.referenceNumber,
          'invoiceDate':json.jaipurDiscomNote.date,
          'invoiceRaisedTo':json.addressJson.invoice_raised_to,
          'discomName':json.addressJson.discom_name,
          'address':json.addressJson.address,
          'addressLineTwo':json.addressJson.address_line_two,
          'city':json.addressJson.city,
          'state':json.addressJson.state,
          'pin':json.addressJson.pin,
          'txnType': transactionType,
          'txnTypeSmall': json.transaction_type_small,
          'gst_number':'GST123',
          'period': totalArr[0].period,
          'dueDate' : json.dueDateForViewOnly,
          'psaDate':json.addressJson.amendmentDate1,
          'psaDate2':json.addressJson.amendmentDate2,
          'discomShortName':'RUVNL',
          'name': json.addressJson.name,
          'designation': json.addressJson.designation,
          'fullForm': json.addressJson.full_form,
          'phone': json.addressJson.phone,
          'txnTypeInCaps' : json.transaction_type_fullCap,
          'jp_count' : json.jaipurDiscomNote.count,
          'jp_invoiceType' : json.jaipurDiscomNote.invoice,
          'jp_invoiceNum' : json.jaipurDiscomNote.invoiceNumberJaipur,
          'jp_date' : json.jaipurDiscomNote.date,
          'jp_period' : json.jaipurDiscomNote.period,
          'jp_current_energy' : json.jaipurDiscomNote.current_energy,
          'jp_previous_energy' : json.jaipurDiscomNote.previous_energy,
          'jp_rate' : json.jaipurDiscomNote.rate,
          'jp_current_amount' : json.jaipurDiscomNote.current_amount,
          'jp_previous_amount' : json.jaipurDiscomNote.previous_amount,
          'jp_grand_total' : json.jaipurDiscomNote.grand_total,
          'jp_grandTotalInWords' : json.jaipurDiscomNote.amount_inwords,
          'aj_count' : json.ajmerDiscomNote.count,
          'aj_invoiceType' : json.ajmerDiscomNote.invoice,
          'aj_invoiceNum' : json.ajmerDiscomNote.invoiceNumberAjmer,
          'aj_date' : json.ajmerDiscomNote.date,
          'aj_period' : json.ajmerDiscomNote.period,
          'aj_current_energy' : json.ajmerDiscomNote.current_energy,
          'aj_previous_energy' : json.ajmerDiscomNote.previous_energy,
          'aj_rate' : json.ajmerDiscomNote.rate,
          'aj_current_amount' : json.ajmerDiscomNote.current_amount,
          'aj_previous_amount' : json.ajmerDiscomNote.previous_amount,
          'aj_grand_total' : json.ajmerDiscomNote.grand_total,
          'aj_grandTotalInWords' : json.ajmerDiscomNote.amount_inwords,
          'jd_count' : json.jodhpurDiscomNote.count,
          'jd_invoiceType' : json.jodhpurDiscomNote.invoice,
          'jd_invoiceNum' : json.jodhpurDiscomNote.invoiceNumberJodhpur,
          'jd_date' : json.jodhpurDiscomNote.date,
          'jd_period' : json.jodhpurDiscomNote.period,
          'jd_current_energy' : json.jodhpurDiscomNote.current_energy,
          'jd_previous_energy' : json.jodhpurDiscomNote.previous_energy,
          'jd_rate' : json.jodhpurDiscomNote.rate,
          'jd_current_amount' : json.jodhpurDiscomNote.current_amount,
          'jd_previous_amount' : json.jodhpurDiscomNote.previous_amount,
          'jd_grand_total' : json.jodhpurDiscomNote.grand_total,
          'jd_grandTotalInWords' : json.jodhpurDiscomNote.amount_inwords,
          'grandTotal' : json.grnadTotalForAll,
          'grandTotalInWords' : json.amount_inwords,
          'preriod1' : AnnexureTwoDataJson.start_month,
          'preriod2' : AnnexureTwoDataJson.end_month,
          'Ar' : AnnexureTwoDataJson.spdData,
          'totalEnergyA' : AnnexureTwoDataJson.spd_total_energy_A,
          'totalAmountA' : AnnexureTwoDataJson.spd_total_amount_A,
          'ar2' : AnnexureTwoDataJson.discomData,
          'totalEnergyB' : AnnexureTwoDataJson.discom_total_energy_B,
          'totalAmountB' : AnnexureTwoDataJson.discom_total_amount_B,
          'totalEnergyC' : AnnexureTwoDataJson.total_energy,
          'totalAmountC' : AnnexureTwoDataJson.total_amount,
          'totalAmountCinWords' : AnnexureTwoDataJson.amount_inwords,
          'jpPer' : AnnexureTwoDataJson.jaipurDiscom.jaipur_percentage,
          'jpEnergy' : AnnexureTwoDataJson.jaipurDiscom.jaipur_energy,
          'jpAmount' : AnnexureTwoDataJson.jaipurDiscom.jaipur_amount,
          'ajPer' : AnnexureTwoDataJson.ajmerDiscom.ajmer_percentage,
          'ajEnergy' : AnnexureTwoDataJson.ajmerDiscom.ajmer_energy,
          'ajAmount' : AnnexureTwoDataJson.ajmerDiscom.ajmer_amount,
          'jdPer' : AnnexureTwoDataJson.jodhpurDiscom.jodhpur_percentage,
          'jdEnergy' : AnnexureTwoDataJson.jodhpurDiscom.jodhpur_energy,
          'jdAmount' : AnnexureTwoDataJson.jodhpurDiscom.jodhpur_amount,
          'ar3' : AnnexureOneDataArr,
          'anx2Period' : totalArr[0].period,
          'anx2BeforLoss' : totalArr[0].totalRealBeforeLoss,
          'anx2AfterLoss' : totalArr[0].totalRealAfterLoss,
        });
        doc.render();
        var buffer = doc.getZip().generate({
            type: "nodebuffer"
        });
        fs.writeFileSync(process.env.PWD + '/.uploads/Invoices/RajasthanCreditDebitNote/'+pdfFileName+'.docx', buffer);
        spawn = Npm.require('child_process').spawn;
        console.log("Executing post");
        command = spawn('libreoffice', ['--headless', '--convert-to', 'pdf', process.env.PWD + '/.uploads/Invoices/RajasthanCreditDebitNote/'+pdfFileName+'.docx', '--outdir', process.env.PWD + '/.uploads/Invoices/RajasthanCreditDebitNote']);
        command.stdout.on('data', function(data) {
            console.log('stdout: ' + data);
        });
        command.stderr.on('data', function(data) {
            console.log('stderr: ' + data);
        });
        command.on('exit', function(code) {
            console.log('child process exited with code ' + code);
        });
        // Meteor.setTimeout(function() {
        //     Meteor.call('deleteUploadedFile', process.env.PWD + '/.uploads/Invoices/RajasthanCreditDebitNote/'+pdfFileName+'.docx');
        // }, 4000);
        console.log('Rajasthan Credit Debit Note PDF Generated!');
    },
    //Getting Temporary Saved Data for Credit/Debit Note
    getTemporarySavedData_GST: function(month, year, discomVar,financialYear){
      var tempData = TemporaryInvoice.find({ month:month,year:year,discom_state:discomVar,financial_year:financialYear}).fetch();
      var dataArr = [];
      var returnData = '';
      if(tempData.length > 0){
        tempData.forEach(function(item){
          if (item.type!= 'Provisional Invoice') {
            dataArr.push(item);
          }
        });
        var returnData = dataArr[0];
      }
      return returnSuccess('Getting temporary save data of energy invoice',returnData);
    },
    // Maharashtra Provisional Invoice and Credit/Debit Note
    MaharashtraProvisionalandCreditDebitNote_GST: function(month, year, discomVar,transactionVar,annexureDataArr,annexureMonthVar,previousProvisionalVar,financialYear,annexureYearVar,signatureJson,invoiceDate){
      TemporaryInvoice.update(
         { month:month,year:year,discom_state:discomVar,type:transactionVar,financial_year:financialYear},
         {
           month:month,
           year:year,
           discom_state:discomVar,
           type:transactionVar,
           financial_year:financialYear,
           annexure_month:annexureMonthVar,
           annexure_year:annexureYearVar,
           provisional_total_energy:previousProvisionalVar,
           data :annexureDataArr,
           signature:signatureJson,
           timestamp: new Date()
         },
         { upsert: true }
      );
      var discomAddress = Discom.find({
          discom_state: discomVar
      }).fetch();
      // geting address as well as discom name
          var addressJson = {
              invoice_raised_to : discomAddress[0].invoice_raised_to,
              discom_name: discomAddress[0].nameof_buyingutility,
              address: discomAddress[0].discom_address,
              address_line_two:discomAddress[0].discom_address_line_two,
              city: discomAddress[0].discom_city,
              state: discomAddress[0].discom_state,
              pin: discomAddress[0].discom_pin,
              amendmentDate1: discomAddress[0].date_of_amendment_one,
              amendmentDate2: discomAddress[0].date_of_amendment_two,
              fax: discomAddress[0].discom_fax,
              name: signatureJson.name,
              designation: signatureJson.designation,
              full_form:signatureJson.full_form,
              phone:signatureJson.phone
          };
      // getting period
      var dateArr = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
      // getting period for Provisional
      var fromDateMonth = getArray(dateArr, Number(month));
      var provisional_period = fromDateMonth + "'" + year;
      //geting period for credit/debit note
      var fromDateMonthAnnex = getArray(dateArr, Number(annexureMonthVar));
      var annexure_period = fromDateMonthAnnex + "'" + annexureYearVar;
      // getting current, due date, first date and last dateof month
      var date = new Date(year, Number(annexureMonthVar) - 1, 1);
      var dateArr = [];
      while (date.getMonth() == Number(annexureMonthVar) - 1) {
          var update = date.getDate() + "-" + Number(annexureMonthVar) + "-" + Number(annexureYearVar);
          var newDate = update.split("-");
          var myObject = new Date(newDate[2], newDate[1] - 1, newDate[0]);
          dateArr.push(myObject);
          date.setDate(date.getDate() + 1);
      }
      var firstDate = dateArr[0];
      var lastDate = dateArr[Number(dateArr.length - 1)];
      var startDateOfMonth = moment(firstDate).format("DD MMMM YYYY");
      var startDateOfMonthToInsert = moment(firstDate).format("DD-MM-YYYY");
      var endDateOfMonth = moment(lastDate).format("DD MMMM YYYY");
      var endDateOfMonthToInsert = moment(lastDate).format("DD-MM-YYYY");

      var currentDate = new Date();
      var dateFormat = moment(currentDate).format("DD MMMM YYYY");
      var currentMonthVar = moment(currentDate).format("MMMM");
      var dateFormatToInsert = moment(currentDate).format('DD-MM-YYYY');
      var myDate = moment().add(30, 'days');
      var duedate = myDate.format('DD-MM-YYYY');
      var creditDebitDate = changeDateFormatAsRequired(invoiceDate);
      var dueDateForViewOnly = myDate.format("DD MMMM YYYY");
      // getting annexureOne Data
      var spdDataMaharashtra = [];
      var spdDataMaharashtraToInsert = [];
      var spdTotalEnergy = 0;
      var spdTotalAmount = 0;
      var i = 0;
      var data = Discom.find({
          discom_state: discomVar
      }).fetch();

      var energyInvoiceRate = InvoiceCharges.find({state:discomVar,invoice_type:'Energy_Invoice',financial_year:financialYear}).fetch();
      if(energyInvoiceRate.length > 0){
        var rate = Number(energyInvoiceRate[0].rate);
      }else{
        var rate = 1;
      }
      //calculating JMR energy on the basis of  SPD and make json and push in array
      annexureDataArr.forEach(function(item) {
          i++;
          spdDataMaharashtra.push({
              sn: i,
              spd_nane: item.name,
              energy: item.energy,
              rate: rate.toFixed(2),
              amount: amountInComman((Number(item.energy) * Number(rate)).toFixed(2))
          });
          spdDataMaharashtraToInsert.push({
              sn: i,
              spd_nane: item.name,
              energy: item.energy,
              rate: rate.toFixed(2),
              amount: Number(Number(item.energy) * Number(rate)).toFixed(2)
          });
          spdTotalEnergy += Number(item.energy);
          spdTotalAmount += (Number(item.energy) * Number(rate));
      });
      spdTotalEnergy = Number(spdTotalEnergy).toFixed(2);
      var numberOfGeneration = 1 ;
      var creditNo = 1;EnergyInvoiceDetails
      var checkData = EnergyInvoiceDetails.find({discom_state:discomVar,month:month,year:year,financial_year:financialYear,type:transactionVar, delete_status:false},{sort: {$natural: -1},limit: 1}).fetch();
      if(checkData.length > 0){
        if(checkData[0].month == month && checkData[0].year == year && checkData[0].financial_year == financialYear){
            numberOfGeneration = Number(checkData[0].numberOfGeneration + 1);
            creditNo = Number(checkData[0].numberOfGeneration + 1);
        }
      }
      //creting json for annexure one
      var annexureOneJson = {addressJson:addressJson,start_period:startDateOfMonth, end_period:endDateOfMonth, spd_data:spdDataMaharashtra, grnad_total_energy:spdTotalEnergy,grnad_total_amount:amountInComman(Number(spdTotalAmount).toFixed(2)),actual_grnad_total_amount:Number(spdTotalAmount).toFixed(2)};

      var transactionType = '';
      var transaction_type = '';
      var creditTypeVar = '';
      var grand_total_energy = 0;
      var grand_total_amount = 0;
      //for credit/debit
      var presentAmount = (Number(spdTotalEnergy) * Number(rate)).toFixed(2);
      var previousAmount = (Number(previousProvisionalVar) * Number(rate)).toFixed(2);
      if(transactionVar == 'Credit'){
        creditTypeVar = 'C';
        transactionType = 'Credit';
        transaction_type = 'credit';
        //for credt/debit
        grand_total_energy = Number(Number(spdTotalEnergy) - Number(previousProvisionalVar)).toFixed(2);
        // grand_total_amount = (Number(presentAmount) - Number(previousAmount)).toFixed(2);
        grand_total_amount = Number(Number(grand_total_energy) * Number(rate)).toFixed(2);
      }else{
        creditTypeVar = 'D';
        transactionType = 'Debit';
        transaction_type = 'debit';
        //for credt/debit
        grand_total_energy = Number(Number(spdTotalEnergy) - Number(previousProvisionalVar)).toFixed(2);
        // grand_total_amount = (Number(presentAmount) - Number(previousAmount)).toFixed(2);
        grand_total_amount = Number(Number(grand_total_energy) * Number(rate)).toFixed(2);
      }

      var creditNumVar = creditNo+''+creditTypeVar;
      var creditNoteNumber = "SECI/OA/MSEDCL/VISHWAJ-SHARDA-SUNILHITECH-IL&FS-TODAY GREEN/"+annexure_period+"/"+numberOfGeneration;
      var transactionJson = {creditNo:creditNo,credit_no:creditNumVar,credit_note_no:creditNoteNumber,transaction_type:transactionType,invoice_date:creditDebitDate,due_date:dueDateForViewOnly,period:annexure_period,present_energy:spdTotalEnergy,previous_energy:previousProvisionalVar,total_energy:grand_total_energy,rate:rate.toFixed(2), present_amount:amountInComman(presentAmount), actual_present_amount:presentAmount, previous_amount:amountInComman(previousAmount),actual_previous_amount:previousAmount,total_amount:amountInComman(grand_total_amount),actual_total_amount:grand_total_amount,amount_inwords:amountInWords(grand_total_amount)};


      //for provisional
      var provisioal_grand_total_energy = 0;
      var provisioal_grand_total_amount = 0;
      var provisioal_total_amount = (Number(previousProvisionalVar) * Number(rate)).toFixed(2);
      var transaction_total_amount = (Number(grand_total_energy) * Number(rate)).toFixed(2);
      // if(transactionVar == 'Credit'){
      //   provisioal_grand_total_energy = (Number(previousProvisionalVar) - Number(grand_total_energy)).toFixed(2);
      //   provisioal_grand_total_amount = (Number(provisioal_total_amount) - Number(transaction_total_amount)).toFixed(2);
      // }else{}
        provisioal_grand_total_energy = (Number(previousProvisionalVar) + Number(grand_total_energy)).toFixed(2);
        // provisioal_grand_total_amount = (Number(provisioal_total_amount) + Number(transaction_total_amount)).toFixed(2);
        provisioal_grand_total_amount = Number(Number(provisioal_grand_total_energy) * Number(rate)).toFixed(2);

      var invoiceNumber = "SECI/OA/MSEDCL/VISHWAJ-SHARDA-SUNILHITECH-IL&FS-TODAY GREEN/"+provisional_period+"/"+numberOfGeneration;
      var provisionalInvoice = {invoice_number:invoiceNumber,transaction_type:transaction_type,creditNumVar:creditNumVar,invoice_date:dateFormat,due_date:dueDateForViewOnly,period:provisional_period,provisional_energy:previousProvisionalVar,annexure_energy:Number(Number(grand_total_energy)*-1),total_energy:provisioal_grand_total_energy,rate:rate.toFixed(2), provisional_amount:amountInComman(provisioal_total_amount), actual_provisional_amount:provisioal_total_amount, annexure_amount:amountInComman(Number(transaction_total_amount)*Number(-1)),actual_annexure_amount:transaction_total_amount, total_amount:amountInComman(provisioal_grand_total_amount),actual_total_amount:provisioal_grand_total_amount,amount_inwords:amountInWords(provisioal_grand_total_amount)};

      var referenceNumber = "SECI/PS/JNNSM-750/MSEDCL/"+year+"/"+fromDateMonth+"/"+numberOfGeneration;
      var InvoiceTypeVar = transactionVar+' Note';
      //final json to return all data
      var jsonToInsertProvisional = {
                  reference_number:referenceNumber,
                  invoice_number:invoiceNumber,
                  discom_id:data[0]._id,
                  discom_name:data[0].nameof_buyingutility,
                  discom_state:discomVar,
                  numberOfGeneration:numberOfGeneration,
                  energy_invoice_generation_date:dateFormatToInsert,
                  energy_invoice_due_date:duedate,
                  month:month,
                  year:year,
                  financial_year:financialYear,
                  rate_per_unit:rate,
                  total_energy:previousProvisionalVar,
                  total_amount:provisioal_total_amount,
                  type:'Provisional_Invoice',
                  typeOfInvoice:'Provisional Invoice',
                  delete_status:false,
                  timestamp:new Date()
                  };

                  var todayGreenId = discomAddress[0].spdIds[0].spdId;
                  var ShardaConstId= discomAddress[0].spdIds[1].spdId;
                  var VishwajId = discomAddress[0].spdIds[2].spdId;
                  var SunilhitechId = discomAddress[0].spdIds[3].spdId;
                  var ILNFSId = discomAddress[0].spdIds[4].spdId;

        var jsonToInsertCreditDebit = {
                reference_number:referenceNumber,
                invoice_number:creditNoteNumber,
                discom_id:data[0]._id,
                discom_name:data[0].nameof_buyingutility,
                discom_state:discomVar,
                numberOfGeneration:numberOfGeneration,
                jsonILFS:{spdId:ILNFSId,invoice_number:creditNoteNumber,spd_nane:spdDataMaharashtraToInsert[0].spd_nane,total_energy:spdDataMaharashtraToInsert[0].energy,total_amount:spdDataMaharashtraToInsert[0].amount,rate_per_unit:rate},
                JsonTodayGreen:{spdId:todayGreenId,invoice_number:creditNoteNumber,spd_nane:spdDataMaharashtraToInsert[1].spd_nane,total_energy:spdDataMaharashtraToInsert[1].energy,total_amount:spdDataMaharashtraToInsert[1].amount,rate_per_unit:rate},
                jsonShardaConstruction:{spdId:ShardaConstId,invoice_number:creditNoteNumber,spd_nane:spdDataMaharashtraToInsert[2].spd_nane,total_energy:spdDataMaharashtraToInsert[2].energy,total_amount:spdDataMaharashtraToInsert[2].amount,rate_per_unit:rate},
                jsnVishvajEnergy:{spdId:VishwajId,invoice_number:creditNoteNumber,spd_nane:spdDataMaharashtraToInsert[3].spd_nane,total_energy:spdDataMaharashtraToInsert[3].energy,total_amount:spdDataMaharashtraToInsert[3].amount,rate_per_unit:rate},
                jsonSunilHitech:{spdId:SunilhitechId,invoice_number:creditNoteNumber,spd_nane:spdDataMaharashtraToInsert[4].spd_nane,total_energy:spdDataMaharashtraToInsert[4].energy,total_amount:spdDataMaharashtraToInsert[4].amount,rate_per_unit:rate},
                energy_invoice_generation_date:dateFormatToInsert,
                energy_invoice_due_date:duedate,
                month:annexureMonthVar,
                year:annexureYearVar,
                financial_year:getFinancialYearByMonthAndYear(annexureMonthVar,annexureYearVar),
                rate_per_unit:rate,
                provisional_total_energy:previousProvisionalVar,
                provisional_total_amount:provisioal_total_amount,
                total_energy:grand_total_energy,
                total_amount:grand_total_amount,
                actual_energy:spdTotalEnergy.toString(),
                actual_amount:presentAmount,
                annexure_month:annexureMonthVar,
                annexure_year:annexureYearVar,
                annexureOneJson:{start_period:startDateOfMonthToInsert, end_period:endDateOfMonthToInsert, spd_data:spdDataMaharashtraToInsert,total_energy:spdTotalEnergy,total_amount:Number(spdTotalAmount).toFixed(2)},
                type:transactionVar,
                typeOfInvoice:InvoiceTypeVar,
                delete_status:false,
                timestamp:new Date()
                };
      var returnJsonForInsertData = {jsonToInsertProvisional:jsonToInsertProvisional,jsonToInsertCreditDebit:jsonToInsertCreditDebit};
      var coverLetterJson = {reference_number:referenceNumber,invoice_date:dateFormat,period:provisional_period,invoice_number:invoiceNumber,amount:amountInComman(provisioal_grand_total_amount),actual_amount:provisioal_grand_total_amount,amount_inwords:amountInWords(provisioal_grand_total_amount)};
      var returnJson = {addressJson:addressJson,annexureOneJson:annexureOneJson,transactionJson:transactionJson,provisionalInvoice:provisionalInvoice,coverLetterJson:coverLetterJson};
      var finalJson = {returnJson:returnJson,returnJsonForInsertData:returnJsonForInsertData};

      var TodayDateVar = moment().format('DD-MM-YYYY');
      var random = Math.floor((Math.random() * 10000) + 1).toString();
      var pdfFileName = 'Maharashtra_'+transactionType+'_Note_'+TodayDateVar+'_'+random;
      Meteor.call('GST_generatingMaharashtraProvisionalAndCreditDebitNotePDF',transactionType,addressJson, coverLetterJson, provisionalInvoice, transactionJson, annexureOneJson, pdfFileName);
      var path = "/upload/Invoices/MaharashtraCreditDebitNote/"+pdfFileName+".pdf";
      var pathDocx = "/upload/Invoices/MaharashtraCreditDebitNote/"+pdfFileName+".docx";
      var jsonProvisional = jsonToInsertProvisional;
      var jsonCreditDebit = jsonToInsertCreditDebit;
      jsonProvisional.file_path = path;
      jsonProvisional.file_path_docx = pathDocx;
      jsonCreditDebit.file_path = path;
      jsonCreditDebit.file_path_docx = pathDocx;
      EnergyInvoiceDetails.insert(jsonProvisional);
      EnergyInvoiceDetails.insert(jsonCreditDebit);
      // Insert Query For Maharashtra Provisional & Credit Debit Note Invoice
      var ip = this.connection.httpHeaders['x-forwarded-for'];
      var ipArr = ip.split(',');
      var logJson = {
        ip_address : ipArr,
        log_type: 'Maharashtra Credit/Debit Note Generated',
        template_name: 'generateInvoice',
        event_name: 'energyBtnView',
        state:discomVar,
        json_provisional:jsonProvisional,
        json_creditDebit:jsonCreditDebit
      }
      // Send Json To insert Log Details by using insertJsonForInvoiceLog method
      var invoiceLog = insertJsonForInvoiceLog(logJson);
      return returnSuccess(discomVar+' '+transactionType+' Note Generated for the month of '+month+"'"+year, path);
      // return returnSuccess(discomVar+' '+transactionType+' Note Generated for the month of '+month+"'"+year, finalJson);
    },
    // Maharashtra Credit Debit Note Docx to PDF
    GST_generatingMaharashtraProvisionalAndCreditDebitNotePDF(transactionType, addressJson, coverLetterJson, provisionalInvoice, transactionJson, annexureOneJson, pdfFileName) {
        var fs = require('fs');
        var Docxtemplater = require('docxtemplater');
        if (transactionType == 'Credit') {
          var filepath = Assets.absoluteFilePath('MaharashtraProvisionalAndCreditNoteInvoice.docx');
        }else {
          var filepath = Assets.absoluteFilePath('MaharashtraProvisionalAndDebitNoteInvoice.docx');
        }
        var content = fs.readFileSync(filepath, "binary");
        var doc = new Docxtemplater(content);
        doc.setData({
          'refNumber':coverLetterJson.reference_number,
          'invNumber':coverLetterJson.invoice_number,
          'invoiceDate':coverLetterJson.invoice_date,
          'invoiceRaisedTo':addressJson.invoice_raised_to,
          'discomName':addressJson.discom_name,
          'address':addressJson.address,
          'addressLineTwo':addressJson.address_line_two,
          'city':addressJson.city,
          'state':addressJson.state,
          'pin':addressJson.pin,
          'gst_number':'GST123',
          'period': coverLetterJson.period,
          'psaDate':addressJson.amendmentDate1,
          'discomShortName':'MSEDCL',
          'name': addressJson.name,
          'designation': addressJson.designation,
          'fullForm': addressJson.full_form,
          'phone': addressJson.phone,
          'provInvoiceNum' : coverLetterJson.invoice_number,
          'p1Amount' : coverLetterJson.amount,
          'p1AmountInWords' : coverLetterJson.amount_inwords,
          'txnTypeSmall': provisionalInvoice.transaction_type,
          'provInvNum' : provisionalInvoice.amount_inwords,
          'provPeriod' : provisionalInvoice.period,
          'provDueDate' : provisionalInvoice.due_date,
          'provEnergy' : provisionalInvoice.provisional_energy,
          'provRate' : provisionalInvoice.rate,
          'provAmount' : provisionalInvoice.provisional_amount,
          'count' : provisionalInvoice.creditNumVar,
          'creditNoteNo' : transactionJson.credit_note_no,
          'anxEnergy' : provisionalInvoice.annexure_energy,
          'anxAmount' : provisionalInvoice.annexure_amount,
          'totalEnergy' : provisionalInvoice.total_energy,
          'totalAmount' : provisionalInvoice.total_amount,
          'totalAmountInWords' :provisionalInvoice.amount_inwords,
          'dueDate' : provisionalInvoice.due_date,
          'txnType': transactionJson.transaction_type,
          'creditNo' : transactionJson.creditNo,
          'credit_no' : transactionJson.credit_no,
          'credit_note_no' : transactionJson.credit_note_no,
          'invoice_date' : transactionJson.invoice_date,
          'txnPeriod' : transactionJson.period,
          'txnDueDate' : transactionJson.due_date,
          'txnPresEne' : transactionJson.present_energy,
          'txnPrevEne' : transactionJson.previous_energy,
          'txnRate' : transactionJson.rate,
          'txnPresAmt' : transactionJson.present_amount,
          'txnPrevAmt' : transactionJson.previous_amount,
          'txnTotalEnergy' : transactionJson.total_energy,
          'txnTotalAmt' : transactionJson.total_amount,
          'txnTotalAmtInWords' : transactionJson.amount_inwords,
          'anxP1' : annexureOneJson.start_period,
          'anxP2' : annexureOneJson.end_period,
          'axAr' : annexureOneJson.spd_data,
          'anxTotalEnergy' : annexureOneJson.grnad_total_energy,
          'anxTotalAmount' : annexureOneJson.grnad_total_amount,
        });
        doc.render();
        var buffer = doc.getZip().generate({
            type: "nodebuffer"
        });
        fs.writeFileSync(process.env.PWD + '/.uploads/Invoices/MaharashtraCreditDebitNote/'+pdfFileName+'.docx', buffer);
        spawn = Npm.require('child_process').spawn;
        console.log("Executing post");
        command = spawn('libreoffice', ['--headless', '--convert-to', 'pdf', process.env.PWD + '/.uploads/Invoices/MaharashtraCreditDebitNote/'+pdfFileName+'.docx', '--outdir', process.env.PWD + '/.uploads/Invoices/MaharashtraCreditDebitNote']);
        command.stdout.on('data', function(data) {
            console.log('stdout: ' + data);
        });
        command.stderr.on('data', function(data) {
            console.log('stderr: ' + data);
        });
        command.on('exit', function(code) {
            console.log('child process exited with code ' + code);
        });
        // Meteor.setTimeout(function() {
        //     Meteor.call('deleteUploadedFile', process.env.PWD + '/.uploads/Invoices/MaharashtraCreditDebitNote/'+pdfFileName+'.docx');
        // }, 4000);
        console.log('Maharashtra Credit Debit Note PDF Generated!');
    },
    //rajasthan transmission charges
    RajasthanSPDListForTransmissionCharges_GST: function(selectedState) {
        var spdArr = [];
        var discomData = Discom.find().fetch();
        discomData.forEach(function(itemData){
          itemData.spdIds.forEach(function(item){
          if(item.transaction_type == 'Inter' && item.spdState == 'Rajasthan'){
            spdArr.push(itemData.discom_state);
          }
        });
      });
        return returnSuccess('Found SPD List', _.uniq(spdArr));
    },
    // getting last inserted invoice number for gujarat Transmission Charges only
    InvoiceNumberTransmissionCharges_GST: function(selectedState) {
        // show privious invoice number for gujarat only
        var invoiceData = TransmissionInvoiceDetails.find({
            discom_state: 'Odisha',
            spd_state:selectedState,
            delete_status:false
        }, {
            sort: {
                $natural: -1
            },
            limit: 1
        }).fetch();
        var returnData = '';
        if (invoiceData.length > 0) {
            returnData = invoiceData[0].getco_invoice_number;
        }
        return returnSuccess('Found SPD List', returnData);
    },
    // Transmission invoice generated from here
    ViewTransmissionChargesData_GST: function(month, year, discomVar, discomStateVar, invoiceArr,financialYear,discomState,formDateForMP,toDateForMP,totalEnergy,invoiceDateVar,signatureJson) {
        if (discomVar == 'Gujarat') {
            var returnDataArr = [];
            var spdNames = [];
            var discomAddress = Discom.find({
                discom_state: 'Odisha'
            }).fetch();
            if (discomVar == 'Gujarat') {
                var addressJson = {
                    invoice_raised_to : discomAddress[0].invoice_raised_to,
                    discomName: discomAddress[0].nameof_buyingutility,
                    address: discomAddress[0].discom_address,
                    address_line_two:discomAddress[0].discom_address_line_two,
                    city: discomAddress[0].discom_city,
                    state: discomAddress[0].discom_state,
                    pin: discomAddress[0].discom_pin,
                    fax: discomAddress[0].discom_fax,
                    amendmentDate1: discomAddress[0].date_of_amendment_one,
                    name: signatureJson.name,
                    designation: signatureJson.designation,
                    full_form:signatureJson.full_form,
                    phone:signatureJson.phone
                };
            }
            var date = new Date(year, month - 1, 1);
            var result = [];
            var dateArr = [];

            while (date.getMonth() == month - 1) {
                var update = date.getDate() + "-" + month + "-" + year;
                var newDate = update.split("-");
                var myObject = new Date(newDate[2], newDate[1] - 1, newDate[0]);
                dateArr.push(myObject);
                date.setDate(date.getDate() + 1);
            }
            var firstDate = dateArr[0];
            var lastDate = dateArr[Number(dateArr.length - 1)];
            var NumberOfDays = moment(lastDate).format('DD');

            // geting rate for transmission charges
            var TransmissionRate = InvoiceCharges.find({state:discomVar,invoice_type:'Transmission_Charges',financial_year:financialYear}).fetch();
            if(TransmissionRate.length > 0){
              var transmissionCharges = Number(TransmissionRate[0].rate).toFixed(2);
            }else{
              var transmissionCharges = Number(1).toFixed(2);
            }
            var spdid = [];
            var data = Discom.find({
                discom_state: 'Odisha'
            }).fetch();

            data[0].spdIds.forEach(function(item) {
                var userData = Meteor.users.find({
                    _id: item.spdId
                }).fetch();
                var transactionType = userData[0].profile.registration_form.transaction_type;
                if (transactionType == 'Inter' && userData[0].profile.registration_form.spd_state == 'Gujarat') {
                    spdid.push(item.spdId);
                }
            });
            var dataArray = [];
            var grandTotal = 0;
            var j = 1;
            spdid.forEach(function(item) {
                var data = Meteor.users.find({
                    _id: item
                }).fetch();
                dataArray.push({
                    sn: j,
                    name: data[0].profile.registration_form.name_of_spd,
                    numberOfDay: NumberOfDays,
                    transmissionCharges: Number(transmissionCharges),
                    capacity: data[0].profile.registration_form.project_capicity,
                    amount: amountInComman((Number(NumberOfDays) * Number(transmissionCharges) * Number(data[0].profile.registration_form.project_capicity)).toFixed(2))
                });
                j++;
                grandTotal = grandTotal + (Number(NumberOfDays) * Number(transmissionCharges) * Number(data[0].profile.registration_form.project_capicity));
            });
            //----------using collection for storing invoice no or data-----
            var currentDate = new Date();
            var dateFormat = moment(currentDate).format("DD MMMM YYYY");
            var dateFormatToInsert = moment(currentDate).format('DD-MM-YYYY');
            var myDate = moment().add(10, 'days');
            var duedate = myDate.format('DD-MM-YYYY');
            var dueDateForViewOnly = myDate.format('DD MMMM YYYY');
            var invoiceDateVarForGuj = new Date(invoiceDateVar);
            var getcoInvoiceDateVarToInsert = moment(invoiceDateVarForGuj).format('DD-MM-YYYY');
            var getcoInvoiceDateVarToShow = moment(invoiceDateVarForGuj).format("DD MMMM YYYY");
            var date = new Date();
            var monthInNumber = Number(moment(date).format('MM'));
            var YearVar = Number(moment(date).format('YYYY'));
            var dateArr = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
            var fromDateMonth = getArray(dateArr, month);
            var period = fromDateMonth+"'"+year;
            var numberOfGeneration = 1;
            var checkData = TransmissionInvoiceDetails.find({
                discom_state: 'Odisha',
                year: year,
                month: month,
                delete_status:false
            }, {
                sort: {
                    $natural: -1
                },
                limit: 1
            }).fetch();
            var numberOfGeneration = 1;
            if(checkData.length > 0){
              if(checkData[0].month == month && checkData[0].year == year){
                  numberOfGeneration = (Number(checkData[0].numberOfGeneration) + Number(1));
              }
            }
            var referenceNumberVar = "SECI/PT/TC/Gujarat/Odisha/" + year + '/' + fromDateMonth + '/' + Number(numberOfGeneration);
            var invoiceNumberVar = "SECI/OA/GRIDCO/GPCL/GSECL/BACKBONE/ENERSAN/TC" + '/' + year + '/' + fromDateMonth + '/' + Number(numberOfGeneration);
            // var json = {
            //   "spdState" : "Gujarat",
            //   "discom_state" : "Odisha",
            //   "month" : month,
            //   "financial_year" : financialYear,
            //   "invoice_number" : invoiceNumberVar,
            //   "project_capicity" : "40",
            //   "generation_date" : dateFormatToInsert,
            //   "due_date" : duedate,
            //   "total_transmission_invoice" : Number(grandTotal).toFixed(2),
            //   "short_payment_amount" : "0",
            //   "date_of_payment" : "",
            //   "payment_amount" : "0",
            //   "sur_charge_amount" : "0",
            //   "sur_charge" : "1.25%",
            //   "year" : year,
            //   "timestamp" : new Date()
            // };
            // console.log('MP TC Invoice,,,,,,,,,,,,,,,,,,');
            // console.log(json);
            var jsonToInsert = {
              reference_number: referenceNumberVar,
              invoice_number: invoiceNumberVar,
              discom_name: discomAddress[0].nameof_buyingutility,
              discom_state: 'Odisha',
              spd_state:'Gujarat',
              generation_date: dateFormatToInsert,
              due_date: duedate,
              month: month,
              year: year,
              financial_year:financialYear,
              numberOfGeneration: numberOfGeneration,
              transmission_charges: transmissionCharges,
              project_capicity: '40',
              total_transmission_invoice: Number(grandTotal).toFixed(2),
              getco_invoice_number: invoiceArr,
              getco_invoice_date:getcoInvoiceDateVarToInsert,
              type:'Transmission_Charges',
              typeOfInvoice:'Transmission Invoice',
              delete_status:false,
              timestamp: new Date()
            };
            returnDataArr.push(addressJson);
            returnDataArr.push(discomVar);
            returnDataArr.push({firstDate: moment(firstDate).format('DD MMMM YYYY'),lastDate: moment(lastDate).format('DD MMMM YYYY'),dueDate:dueDateForViewOnly});
            returnDataArr.push(dataArray);
            returnDataArr.push({grandTotal:amountInComman(grandTotal.toFixed(2)), amount_in_words:amountInWords(grandTotal.toFixed(2))});
            returnDataArr.push({period:period,reference_number: referenceNumberVar,invoice_number: invoiceNumberVar,invoiceDate:getcoInvoiceDateVarToShow});
            returnDataArr.push(jsonToInsert);

            var periodJson = {firstDate: moment(firstDate).format('DD MMMM YYYY'),lastDate: moment(lastDate).format('DD MMMM YYYY'),dueDate:dueDateForViewOnly};
            var grandTotalJson = {grandTotal:amountInComman(grandTotal.toFixed(2)), amount_in_words:amountInWords(grandTotal.toFixed(2))};
            var jsonData = {period:period,reference_number: referenceNumberVar,invoice_number: invoiceNumberVar,invoiceDate:getcoInvoiceDateVarToShow};

            var TodayDateVar = moment().format('DD-MM-YYYY');
            var random = Math.floor((Math.random() * 10000) + 1).toString();
            var pdfFileName = discomVar+'_TC_'+TodayDateVar+'_'+random;
            Meteor.call('GST_GujaratTransmissionInvoiceDocxToPDF',discomVar,addressJson,periodJson,dataArray,grandTotalJson,jsonData,invoiceArr,dateFormat,pdfFileName);
            var path = "/upload/Invoices/TransmissionCharges/"+pdfFileName+".pdf";
            var pathDocx = "/upload/Invoices/TransmissionCharges/"+pdfFileName+".docx";
            jsonToInsert.file_path = path;
            jsonToInsert.file_path_docx = pathDocx;
            // Insert Query For Transmission Invoice
            TransmissionInvoiceDetails.insert(jsonToInsert);
            var ip = this.connection.httpHeaders['x-forwarded-for'];
            var ipArr = ip.split(',');
            var logJson = {
              ip_address : ipArr,
              log_type: 'Gujarat Transmission Invoice Generate',
              template_name: 'generateInvoice',
              event_name: 'transmissionChargesBtnView',
              state:discomVar,
              json:jsonToInsert
            }
            var invoiceLog = insertJsonForInvoiceLog(logJson);

         //----------------------------------------------For Rajasthan State ------------------//
        }else if(discomVar == 'Rajasthan') {
            var returnDataArr = [];
            var spdIDArr = [];
            var state = discomVar;
            var data = Discom.find({discom_state:discomStateVar}).fetch();
                        spdIDArr.push({
                            id: data[0].spdIds[0].spdId
                        });
            var json = Meteor.users.find({
                _id: spdIDArr[0].id
            }).fetch();
            var spdState = json[0].profile.registration_form.spd_state;
            var discomAddress = Discom.find({
                discom_state: discomStateVar
            }).fetch();
            if (discomAddress[0].discom_state == 'Delhi(BRPL)' || discomAddress[0].discom_state == 'Delhi(BYPL)' || discomAddress[0].discom_state == 'Delhi(TPDDL)') {
                var addressJson = {
                    invoice_raised_to : discomAddress[0].invoice_raised_to,
                    discomName: discomAddress[0].nameof_buyingutility,
                    address: discomAddress[0].discom_address,
                    address_line_two:discomAddress[0].discom_address_line_two,
                    city: discomAddress[0].discom_city,
                    state: 'Delhi',
                    pin: discomAddress[0].discom_pin,
                    fax: discomAddress[0].discom_fax,
                    name: signatureJson.name,
                    designation: signatureJson.designation,
                    full_form:signatureJson.full_form,
                    phone:signatureJson.phone
                }
                state = 'Delhi';
            } else {
                var addressJson = {
                    invoice_raised_to : discomAddress[0].invoice_raised_to,
                    discomName: discomAddress[0].nameof_buyingutility,
                    address: discomAddress[0].discom_address,
                    address_line_two:discomAddress[0].discom_address_line_two,
                    city: discomAddress[0].discom_city,
                    state: discomAddress[0].discom_state,
                    pin: discomAddress[0].discom_pin,
                    fax: discomAddress[0].discom_fax,
                    name: signatureJson.name,
                    designation: signatureJson.designation,
                    full_form:signatureJson.full_form,
                    phone:signatureJson.phone
                }
            }
            var date = new Date(year, month - 1, 1);
            var result = [];
            var dateArr = [];
            while (date.getMonth() == month - 1) {
                var update = date.getDate() + "-" + month + "-" + year;
                var newDate = update.split("-");
                var myObject = new Date(newDate[2], newDate[1] - 1, newDate[0]);
                dateArr.push(myObject);
                date.setDate(date.getDate() + 1);
            }
            var firstDate = dateArr[0];
            var lastDate = dateArr[Number(dateArr.length - 1)];
            var NumberOfDays = moment(lastDate).format('DD');
            // temprory used of transmission charges
            var TransmissionRate = InvoiceCharges.find({state:discomVar,invoice_type:'Transmission_Charges',financial_year:financialYear}).fetch();
            if(TransmissionRate.length > 0){
              var transmissionCharges = Number(TransmissionRate[0].rate);
            }else{
              var transmissionCharges = Number(1);
            }
            var spdid = [];
            var data = Discom.find({
                discom_state: discomVar
            }).fetch();
            var dataArray = [];
            var grandTotal = 0;
            var j = 1;
            var projCapacityVar = 0;
            if(discomAddress[0].spdIds.length > 0){
              discomAddress[0].spdIds.forEach( function(item){
                if(item.spdState == discomVar){
                  var userdata = Meteor.users.find({_id:item.spdId}).fetch();
                  projCapacityVar = Number(projCapacityVar) + Number(userdata[0].profile.registration_form.project_capicity);
                }
              });
            }else{
              var userdata = Meteor.users.find({_id: spdIDArr[0].id}).fetch();
              projCapacityVar = Number(userdata[0].profile.registration_form.project_capicity);
            }
            var projCapacity = projCapacityVar;
            dataArray.push({
                sn: j,
                numberOfDay: NumberOfDays,
                transmissionCharges: Number(transmissionCharges),
                capacity: Number(projCapacity) * 1000,
                capacity_in_mw: Number(projCapacity),
                amount: (Number(transmissionCharges) * Number(projCapacity) * 1000).toFixed(2)
            });
            j++;
            grandTotal = (Number(transmissionCharges) * Number(projCapacity) * 1000);

            //----------using collection for storing invoice no or data-----
            var currentDate = new Date();
            var dateFormat = moment(currentDate).format("DD MMMM YYYY");
            var dateFormatToInsert = moment(currentDate).format('DD-MM-YYYY');
            var myDate = moment().add(30, 'days');
            var duedate = myDate.format('DD-MM-YYYY');
            var dueDateForViewOnly = myDate.format('DD MMMM YYYY');

            var date = new Date();
            var monthInNumber = Number(moment(date).format('MM'));
            var YearVar = Number(moment(date).format('YYYY'));
            var dateArr = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'];
            var fromDateMonth = getArray(dateArr, Number(month));
            var numberOfGeneration = 1;
            var checkData = TransmissionInvoiceDetails.find({
                discom_state: discomStateVar,
                spd_state:discomVar,
                year: year,
                month: month,
                delete_status:false
            }, {
                sort: {
                    $natural: -1
                },
                limit: 1
            }).fetch();
            var numberOfGeneration = 1;
            if(checkData.length > 0){
              if(checkData[0].month == month && checkData[0].year == year){
                  numberOfGeneration = (Number(checkData[0].numberOfGeneration) + Number(1));
              }
            }
            var referenceNumberVar = "SECI/PT/TC/Rajasthan/" + discomAddress[0].discom_state + '/' + year + '/' + fromDateMonth + '/' + Number(numberOfGeneration);
            var invoiceNumberVar = "SECI/" + discomAddress[0].discom_state + '/' + discomVar + '/Transmission Charges/' + year + '/' + fromDateMonth + '/' + Number(numberOfGeneration);
            // var json = {
            //   "spdState" : "Rajasthan",
            //   "discom_state" : discomStateVar,
            //   "month" : month,
            //   "financial_year" : financialYear,
            //   "invoice_number" : invoiceNumberVar,
            //   "project_capicity" : projCapacity,
            //   "generation_date" : dateFormatToInsert,
            //   "due_date" : duedate,
            //   "total_transmission_invoice" : Number(grandTotal).toFixed(2),
            //   "short_payment_amount" : "0",
            //   "date_of_payment" : "",
            //   "payment_amount" : "0",
            //   "sur_charge_amount" : "0",
            //   "sur_charge" : "1.25%",
            //   "year" : year,
            //   "timestamp" : new Date()
            // };
            // console.log('MP TC Invoice,,,,,,,,,,,,,,,,,,');
            // console.log(json);
            var jsonToInsert = {
              reference_number: referenceNumberVar,
              invoice_number: invoiceNumberVar,
              discom_name: discomAddress[0].nameof_buyingutility,
              discom_state: discomStateVar,
              spd_state:discomVar,
              generation_date: dateFormatToInsert,
              due_date:duedate,
              month: month,
              year: year,
              financial_year:financialYear,
              numberOfGeneration: Number(numberOfGeneration),
              transmission_charges: transmissionCharges,
              project_capicity: projCapacity,
              total_transmission_invoice: Number(grandTotal).toFixed(2),
              type:'Transmission_Charges',
              typeOfInvoice:'Transmission Invoice',
              delete_status:false,
              timestamp: new Date()
            };
            returnDataArr.push(addressJson);
            returnDataArr.push(spdState);
            returnDataArr.push({firstDate: moment(firstDate).format('DD-MM-YYYY'),lastDate: moment(lastDate).format('DD-MM-YYYY')});
            returnDataArr.push(dataArray);
            returnDataArr.push({grandTotal:amountInComman(grandTotal.toFixed(2)), amount_in_words:amountInWords(grandTotal.toFixed(2))});
            returnDataArr.push({invoiceDate:dateFormat, due_date:dueDateForViewOnly,reference_number: referenceNumberVar,invoice_number: invoiceNumberVar});
            returnDataArr.push(jsonToInsert);

            var periodJson = {firstDate: moment(firstDate).format('DD-MM-YYYY'),lastDate: moment(lastDate).format('DD-MM-YYYY')}
            var grandTotalJson = {grandTotal:amountInComman(grandTotal.toFixed(2)), amount_in_words:amountInWords(grandTotal.toFixed(2))};
            var jsonData = {invoiceDate:dateFormat, due_date:dueDateForViewOnly,reference_number: referenceNumberVar,invoice_number: invoiceNumberVar};

            var TodayDateVar = moment().format('DD-MM-YYYY');
            var random = Math.floor((Math.random() * 10000) + 1).toString();
            var pdfFileName = discomVar+'_TC_'+TodayDateVar+'_'+random;
            Meteor.call('GST_RajasthanTransmissionInvoiceDocxToPDF',month, year,spdState, addressJson,periodJson,dataArray,grandTotalJson,jsonData, pdfFileName);
            var path = "/upload/Invoices/TransmissionCharges/"+pdfFileName+".pdf";
            var pathDocx = "/upload/Invoices/TransmissionCharges/"+pdfFileName+".docx";
            jsonToInsert.file_path = path;
            jsonToInsert.file_path_docx = pathDocx;
            // Insert Query For Transmission Invoice
            TransmissionInvoiceDetails.insert(jsonToInsert);
            var ip = this.connection.httpHeaders['x-forwarded-for'];
            var ipArr = ip.split(',');
            var logJson = {
              ip_address : ipArr,
              log_type: 'Rajasthan Transmission Invoice Generate',
              template_name: 'generateInvoice',
              event_name: 'transmissionChargesBtnView',
              state:discomVar,
              json:jsonToInsert
            }
            var invoiceLog = insertJsonForInvoiceLog(logJson);
            //----------------------------------------------For MP State ------------------//
        }else if(discomVar == 'MP') {
          if(discomState == 'North' || discomState == 'South'){
            var stateVar = 'Bihar';
          }else{
            var stateVar = discomState;
          }
          var returnDataArr = [];
          var spdIDArr = [];
          var state = discomVar;

          var discomAddress = Discom.find({discom_state:stateVar}).fetch();
          if (discomAddress[0].discom_state == 'Bihar') {
            if(discomState == 'North'){
              var biharRatio = 46;
              var addressJson = {
                  invoice_raised_to : discomAddress[0].invoice_raised_to,
                  discomName: 'North '+discomAddress[0].nameof_buyingutility,
                  address: discomAddress[0].discom_address,
                  address_line_two:discomAddress[0].discom_address_line_two,
                  city: discomAddress[0].discom_city,
                  state: discomAddress[0].discom_state ,
                  pin: discomAddress[0].discom_pin,
                  fax: discomAddress[0].discom_fax,
                  amendmentDate: discomAddress[0].date_of_amendment_one,
                  discom_short_name:'N'+discomAddress[0].discom_short_name,
                  spd_data:discomAddress[0].spdIds,
                  name: signatureJson.name,
                  designation: signatureJson.designation,
                  full_form:signatureJson.full_form,
                  phone:signatureJson.phone
              }
              var discomShortName = 'N'+discomAddress[0].discom_short_name;
              var totalEnergy = Number((Number(totalEnergy) * Number(biharRatio))/100);
            }else if(discomState == 'South'){
              var biharRatio = 54;
              var addressJson = {
                  invoice_raised_to : discomAddress[0].invoice_raised_to,
                  discomName: 'South '+discomAddress[0].nameof_buyingutility,
                  address: discomAddress[0].discom_address,
                  address_line_two:discomAddress[0].discom_address_line_two,
                  city: discomAddress[0].discom_city,
                  state: discomAddress[0].discom_state ,
                  pin: discomAddress[0].discom_pin,
                  fax: discomAddress[0].discom_fax,
                  amendmentDate: discomAddress[0].date_of_amendment_one,
                  discom_short_name:'S'+discomAddress[0].discom_short_name,
                  spd_data:discomAddress[0].spdIds,
                  name: signatureJson.name,
                  designation: signatureJson.designation,
                  full_form:signatureJson.full_form,
                  phone:signatureJson.phone
              }
              var discomShortName = 'S'+discomAddress[0].discom_short_name;
              var totalEnergy = Number((Number(totalEnergy) * Number(biharRatio))/100);
            }
          } else {
              var addressJson = {
                  invoice_raised_to : discomAddress[0].invoice_raised_to,
                  discomName: discomAddress[0].nameof_buyingutility,
                  address: discomAddress[0].discom_address,
                  address_line_two:discomAddress[0].discom_address_line_two,
                  city: discomAddress[0].discom_city,
                  state: discomAddress[0].discom_state,
                  pin: discomAddress[0].discom_pin,
                  fax: discomAddress[0].discom_fax,
                  amendmentDate: discomAddress[0].date_of_amendment_one,
                  discom_short_name:discomAddress[0].discom_short_name,
                  spd_data:discomAddress[0].spdIds,
                  name: signatureJson.name,
                  designation: signatureJson.designation,
                  full_form:signatureJson.full_form,
                  phone:signatureJson.phone
              }
              var discomShortName = discomAddress[0].discom_short_name;
          }
          var dateArr = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
          var fromSplit=formDateForMP.split('-');
          var fromMonthInWords = getArray(dateArr, Number(fromSplit[1]));
          var fromDateVar = fromSplit[1]+' '+fromMonthInWords+' '+fromSplit[2];

          var toSplit=toDateForMP.split('-');
          var toMonthInWords = getArray(dateArr, Number(toSplit[1]));
          var toDateVar = toSplit[1]+' '+toMonthInWords+' '+toSplit[2];

          if(Number(fromSplit[1]) == Number(toSplit[1])){
            var numberOfMonth = difference(Date.parse(toSplit[2]+'/'+toSplit[1]+'/'+toSplit[0]), Date.parse(fromSplit[2]+'/'+fromSplit[1]+'/'+fromSplit[0]));
            var periodStart = fromSplit[0]+' '+fromMonthInWords+"'"+fromSplit[2];
            var periodEnd = toSplit[0]+' '+toMonthInWords+"'"+toSplit[2]
            var period = fromMonthInWords+"'"+fromSplit[2];
          }else{
            var numberOfMonth = difference(Date.parse(toSplit[2]+'/'+toSplit[1]+'/'+toSplit[0]), Date.parse(fromSplit[2]+'/'+fromSplit[1]+'/'+fromSplit[0]));
            var periodStart = fromSplit[0]+' '+fromMonthInWords+"'"+fromSplit[2];
            var periodEnd = toSplit[0]+' '+toMonthInWords+"'"+toSplit[2]
            var period = fromMonthInWords+"'"+fromSplit[2]+' - '+toMonthInWords+"'"+toSplit[2];
          }

          var currentDate = new Date();
          var dateFormat = moment(currentDate).format("DD MMMM YYYY");
          var dateFormatToInsert = moment(currentDate).format('DD-MM-YYYY');
          var myDate = moment().add(30, 'days');
          var duedate = myDate.format('DD-MM-YYYY');
          var dueDateForViewOnly = myDate.format('DD MMMM YYYY');

          var TransmissionRate = InvoiceCharges.find({state:discomVar,invoice_type:'Transmission_Charges',financial_year:financialYear}).fetch();
          if(TransmissionRate.length > 0){
            var transmissionCharges = Number(TransmissionRate[0].rate).toFixed(2);
          }else{
            var transmissionCharges = Number(1).toFixed(2);
          }
          var dataJson = {
              sn: 1,
              energy: Number(totalEnergy),
              period:period,
              transmissionCharges: Number(transmissionCharges).toFixed(2),
              amount: (Number(transmissionCharges) * Number(totalEnergy)).toFixed(2)
          };
          var grandTotal = Number(transmissionCharges) * Number(totalEnergy);
          var numberOfGeneration = 1;
          var checkData = TransmissionInvoiceDetails.find({discom_state:stateVar,spd_state:discomVar,year:Number(year),month:Number(month), delete_status:false}, {sort: {$natural: -1},limit: 1}).fetch();
          var numberOfGeneration = 1;
          if(checkData.length > 0){
            if(checkData[0].month == month && checkData[0].year == year){
                numberOfGeneration = (Number(checkData[0].numberOfGeneration) + Number(1));
            }
          }
          var myDate = moment().add(30, 'days');
          var duedate = myDate.format('DD-MM-YYYY');
          var dueDateForViewOnly = myDate.format("DD MMMM YYYY");
          var region = "";
          if (stateVar == 'Bihar') {
            region = discomState+" "+stateVar;
          }else {
            region = stateVar;
          }
          var monthInWords = getArray(dateArr, month);
          var referenceNumberVar = "SECI/PT/" + discomShortName +"/TC/"+ year + '/' + monthInWords + '/' + Number(numberOfGeneration);
          var invoiceNumberVar = "SECI/" + discomShortName + '/' + discomVar + '/Transmission Charges/' + year + '/' + monthInWords + '/' + Number(numberOfGeneration);
          // var json = {
          //   "spdState" : "MP",
          //   "discom_state" : region,
          //   "month" : month,
          //   "financial_year" : financialYear,
          //   "invoice_number" : invoiceNumberVar,
          //   "generation_date" : dateFormatToInsert,
          //   "due_date" : duedate,
          //   "total_energy": totalEnergy,
          //   "total_transmission_invoice" : Number(grandTotal).toFixed(2),
          //   "short_payment_amount" : "0",
          //   "date_of_payment" : "",
          //   "payment_amount" : "0",
          //   "sur_charge_amount" : "0",
          //   "sur_charge" : "1.25%",
          //   "year" : year,
          //   "timestamp" : new Date()
          // };
          // console.log('MP TC Invoice,,,,,,,,,,,,,,,,,,');
          // console.log(json);
          var jsonToInsert = {
            reference_number: referenceNumberVar,
            invoice_number: invoiceNumberVar,
            discom_name: discomAddress[0].nameof_buyingutility,
            discom_state: stateVar,
            region:region,
            spd_state:discomVar,
            generation_date: dateFormatToInsert,
            due_date: duedate,
            month: month,
            year: year,
            financial_year:financialYear,
            numberOfGeneration: Number(numberOfGeneration),
            transmission_charges: transmissionCharges,
            total_energy : totalEnergy,
            total_transmission_invoice: Number(grandTotal).toFixed(2),
            transmission_period_fromDate:formDateForMP,
            transmission_period_toDate:toDateForMP,
            type:'Transmission_Charges',
            typeOfInvoice:'Transmission Invoice',
            delete_status:false,
            timestamp: new Date()
          };
          returnDataArr.push(addressJson);
          returnDataArr.push(discomVar);
          returnDataArr.push({firstDate:periodStart,lastDate: periodEnd, currentDate:dateFormat,due_date:dueDateForViewOnly});
          returnDataArr.push(dataJson);
          returnDataArr.push({grandTotal:amountInComman(grandTotal.toFixed(2)), amount_in_words:amountInWords(grandTotal.toFixed(2))});
          returnDataArr.push({reference_number: referenceNumberVar,invoice_number: invoiceNumberVar});
          returnDataArr.push(jsonToInsert);

          var periodJson = {firstDate:periodStart,lastDate: periodEnd, currentDate:dateFormat,due_date:dueDateForViewOnly}
          var grandTotalJson = {grandTotal:amountInComman(grandTotal.toFixed(2)), amount_in_words:amountInWords(grandTotal.toFixed(2))}
          var jsonData = {reference_number: referenceNumberVar,invoice_number: invoiceNumberVar}

          var TodayDateVar = moment().format('DD-MM-YYYY');
          var random = Math.floor((Math.random() * 10000) + 1).toString();
          var pdfFileName = discomVar+'_TC_'+TodayDateVar+'_'+random;
          Meteor.call('MPTransmissionInvoiceDocxToPDF',discomVar,addressJson,periodJson,dataJson,grandTotalJson,jsonData,pdfFileName);
          var path = "/upload/Invoices/TransmissionCharges/"+pdfFileName+".pdf";
          var pathDocx = "/upload/Invoices/TransmissionCharges/"+pdfFileName+".docx";
          jsonToInsert.file_path = path;
          jsonToInsert.file_path_docx = pathDocx;
          // Insert Query For Transmission Invoice
          TransmissionInvoiceDetails.insert(jsonToInsert);
          var ip = this.connection.httpHeaders['x-forwarded-for'];
          var ipArr = ip.split(',');
          var logJson = {
            ip_address : ipArr,
            log_type: 'MP Transmission Invoice Generate',
            template_name: 'generateInvoice',
            event_name: 'transmissionChargesBtnView',
            state:discomVar,
            json:jsonToInsert
          }
          var invoiceLog = insertJsonForInvoiceLog(logJson);
        }
        return returnSuccess('Transmission Charges Invoice Generated for '+discomVar+' for the month of '+month+"'"+year, path);
    },
    // Gujarat Transmission Invoice Docx to PDF
    GST_GujaratTransmissionInvoiceDocxToPDF(discomVar,addressJson,periodJson,dataArray,grandTotalJson,jsonData,invoiceArr,dateFormat,pdfFileName) {
        var dataOneArr = [];
        for (var i = 0; i < dataArray.length; i++) {
          var json = {sn:invoiceArr[i].sn,inv:invoiceArr[i].invoice_number, d1:periodJson.firstDate, d2:periodJson.lastDate, invDate:jsonData.invoiceDate, amount:dataArray[i].amount};
          dataOneArr.push(json);
        }
        var fs = require('fs');
        var Docxtemplater = require('docxtemplater');
        var filepath = Assets.absoluteFilePath('GujaratTransmissionInvoice.docx');
        var content = fs.readFileSync(filepath, "binary");
        var doc = new Docxtemplater(content);
        doc.setData({
          'referenceNumber':jsonData.reference_number,
          'invoiceNumber':jsonData.invoice_number,
          'invoiceDate':dateFormat,
          'invoiceRaisedTo':addressJson.invoice_raised_to,
          'discomName':addressJson.discomName,
          'address':addressJson.address,
          'addressLineTwo':addressJson.address_line_two,
          'city':addressJson.city,
          'state':addressJson.state,
          'pin':addressJson.pin,
          'gst_number':'GST123',
          'psaDate':addressJson.amendmentDate1,
          'period': jsonData.period,
          'invoiceDateVar':jsonData.invoiceDate,
          'firstDate': periodJson.firstDate,
          'lastDate': periodJson.lastDate,
          'dueDate': periodJson.dueDate,
          'name': addressJson.name,
          'designation': addressJson.designation,
          'fullForm': addressJson.full_form,
          'phone': addressJson.phone,
          'grandTotal': grandTotalJson.grandTotal,
          'grandTotalInWords': grandTotalJson.amount_in_words,
          'Ar': dataArray,//unused key
          'dr': dataOneArr,
          'inv1': dataOneArr[0].inv,
          'inv2': dataOneArr[1].inv,
          'inv3': dataOneArr[2].inv,
          'inv4': dataOneArr[3].inv,

          'a1': dataArray[0].name,
          'a2': dataArray[0].numberOfDay,
          'a3': dataArray[0].transmissionCharges,
          'a4': dataArray[0].capacity,
          'a5': dataArray[0].amount,

          'b1': dataArray[1].name,
          'b2': dataArray[1].numberOfDay,
          'b3': dataArray[1].transmissionCharges,
          'b4': dataArray[1].capacity,
          'b5': dataArray[1].amount,

          'c1': dataArray[2].name,
          'c2': dataArray[2].numberOfDay,
          'c3': dataArray[2].transmissionCharges,
          'c4': dataArray[2].capacity,
          'c5': dataArray[2].amount,

          'd1': dataArray[3].name,
          'd2': dataArray[3].numberOfDay,
          'd3': dataArray[3].transmissionCharges,
          'd4': dataArray[3].capacity,
          'd5': dataArray[3].amount,
        });
        doc.render();
        var buffer = doc.getZip().generate({
            type: "nodebuffer"
        });
        fs.writeFileSync(process.env.PWD + '/.uploads/Invoices/TransmissionCharges/'+pdfFileName+'.docx', buffer);
        spawn = Npm.require('child_process').spawn;
        console.log("Executing post");
        command = spawn('libreoffice', ['--headless', '--convert-to', 'pdf', process.env.PWD + '/.uploads/Invoices/TransmissionCharges/'+pdfFileName+'.docx', '--outdir', process.env.PWD + '/.uploads/Invoices/TransmissionCharges']);
        command.stdout.on('data', function(data) {
            console.log('stdout: ' + data);
        });
        command.stderr.on('data', function(data) {
            console.log('stderr: ' + data);
        });
        command.on('exit', function(code) {
            console.log('child process exited with code ' + code);
        });
        // Meteor.setTimeout(function() {
        //     Meteor.call('deleteUploadedFile', process.env.PWD + '/.uploads/Invoices/TransmissionCharges/'+pdfFileName+'.docx');
        // }, 4000);
        console.log('Gujarat Trasmission Invoice PDF Generated!');
    },
    // Rajasthan Transmission Invoice Docx to PDF
    GST_RajasthanTransmissionInvoiceDocxToPDF(month, year,spdState,addressJson,periodJson,dataArray,grandTotalJson,jsonData, pdfFileName) {
        var dateArr = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
        var myData = getArray(dateArr, month);
        var selectedMonth = myData + "'" + year;
        var fs = require('fs');
        var Docxtemplater = require('docxtemplater');
        var filepath = Assets.absoluteFilePath('RajasthanTransmissionInvoice.docx');
        var content = fs.readFileSync(filepath, "binary");
        var doc = new Docxtemplater(content);
        doc.setData({
          'period' : selectedMonth,
          'referenceNumber':jsonData.reference_number,
          'invoiceNumber':jsonData.invoice_number,
          'invoiceDate':jsonData.invoiceDate,
          'dueDate': jsonData.due_date,
          'invoiceRaisedTo':addressJson.invoice_raised_to,
          'discomName':addressJson.discomName,
          'address':addressJson.address,
          'addressLineTwo':addressJson.address_line_two,
          'city':addressJson.city,
          'state':addressJson.state,
          'pin':addressJson.pin,
          'name': addressJson.name,
          'designation': addressJson.designation,
          'fullForm': addressJson.full_form,
          'phone': addressJson.phone,
          'gst_number':'GST123',
          'firstDate': periodJson.firstDate,
          'lastDate': periodJson.lastDate,
          'grandTotal': grandTotalJson.grandTotal,
          'grandTotalInWords': grandTotalJson.amount_in_words,
          'capacityMW': dataArray[0].capacity_in_mw,
          'capacitykWh': dataArray[0].capacity,
          'numberOfDay': dataArray[0].numberOfDay,
          'amount': dataArray[0].amount,
          'transmissionCharges': dataArray[0].transmissionCharges,
        });
        doc.render();
        var buffer = doc.getZip().generate({
            type: "nodebuffer"
        });
        fs.writeFileSync(process.env.PWD + '/.uploads/Invoices/TransmissionCharges/'+pdfFileName+'.docx', buffer);
        spawn = Npm.require('child_process').spawn;
        console.log("Executing post");
        command = spawn('libreoffice', ['--headless', '--convert-to', 'pdf', process.env.PWD + '/.uploads/Invoices/TransmissionCharges/'+pdfFileName+'.docx', '--outdir', process.env.PWD + '/.uploads/Invoices/TransmissionCharges']);
        command.stdout.on('data', function(data) {
            console.log('stdout: ' + data);
        });
        command.stderr.on('data', function(data) {
            console.log('stderr: ' + data);
        });
        command.on('exit', function(code) {
            console.log('child process exited with code ' + code);
        });
        // Meteor.setTimeout(function() {
        //     Meteor.call('deleteUploadedFile', process.env.PWD + '/.uploads/Invoices/TransmissionCharges/'+pdfFileName+'.docx');
        // }, 4000);
        console.log('Rajasthan Credit Debit Note PDF Generated!');
    },
    // MP Transmission Invoice Docx to PDF
    MPTransmissionInvoiceDocxToPDF(discomVar,addressJson,periodJson,dataJson,grandTotalJson,jsonData,pdfFileName) {
        var stringConCat = '';
        for (var i = 0; i < addressJson.spd_data.length; i++) {
          if (i == 0) {
            stringConCat += 'M/s '+addressJson.spd_data[i].spdName
          }else if(addressJson.spd_data.length - 1 == i){
            stringConCat += ' & M/s '+addressJson.spd_data[i].spdName
          }else {
            stringConCat += ', M/s '+addressJson.spd_data[i].spdName
          }
        }
        var fs = require('fs');
        var Docxtemplater = require('docxtemplater');
        var filepath = Assets.absoluteFilePath('MpTransmissionInvoice.docx');
        var content = fs.readFileSync(filepath, "binary");
        var doc = new Docxtemplater(content);
        doc.setData({
          'referenceNumber':jsonData.reference_number,
          'invoiceNumber':jsonData.invoice_number,
          'invoiceRaisedTo':addressJson.invoice_raised_to,
          'discomName':addressJson.discomName,
          'address':addressJson.address,
          'addressLineTwo':addressJson.address_line_two,
          'city':addressJson.city,
          'state':addressJson.state,
          'pin':addressJson.pin,
          'name': addressJson.name,
          'designation': addressJson.designation,
          'fullForm': addressJson.full_form,
          'phone': addressJson.phone,
          'psaDate': addressJson.amendmentDate,
          'discomShortName': addressJson.discom_short_name,
          'spdData': addressJson.spd_data,
          'gst_number':'GST123',
          'firstDate': periodJson.firstDate,
          'lastDate': periodJson.lastDate,
          'invoiceDate': periodJson.currentDate,
          'dueDate': periodJson.due_date,
          'grandTotal': grandTotalJson.grandTotal,
          'grandTotalInWords': grandTotalJson.amount_in_words,
          'stringConCat': stringConCat,
          'period': dataJson.period,
          'Ar': dataJson,
        });
        doc.render();
        var buffer = doc.getZip().generate({
            type: "nodebuffer"
        });
        fs.writeFileSync(process.env.PWD + '/.uploads/Invoices/TransmissionCharges/'+pdfFileName+'.docx', buffer);
        spawn = Npm.require('child_process').spawn;
        console.log("Executing post");
        command = spawn('libreoffice', ['--headless', '--convert-to', 'pdf', process.env.PWD + '/.uploads/Invoices/TransmissionCharges/'+pdfFileName+'.docx', '--outdir', process.env.PWD + '/.uploads/Invoices/TransmissionCharges']);
        command.stdout.on('data', function(data) {
            console.log('stdout: ' + data);
        });
        command.stderr.on('data', function(data) {
            console.log('stderr: ' + data);
        });
        command.on('exit', function(code) {
            console.log('child process exited with code ' + code);
        });
        // Meteor.setTimeout(function() {
        //     Meteor.call('deleteUploadedFile', process.env.PWD + '/.uploads/Invoices/TransmissionCharges/'+pdfFileName+'.docx');
        // }, 4000);
        console.log('MP Transmission Invoice PDF Generated!');
    },
    //getting discom state for SLDC invoice
    InvoiceForSLDC_GST: function(state) {
        var spdStateArr = [];
        var data = Meteor.users.find({
            "profile.registration_form.spd_state": "Rajasthan",
            "profile.registration_form.transaction_type": "Inter"
        }).fetch();
        data.forEach(function(item) {
            var discomData = Discom.find().fetch();
            discomData.forEach(function(discomItem) {
                discomItem.spdIds.forEach(function(discomData) {
                    if (discomData.spdId == item._id) {
                        spdStateArr.push(discomItem.discom_state);
                    }
                });
            });
        });
        var discomStateVar = _.uniq(spdStateArr);
        return returnSuccess('Discom State for SLDC', discomStateVar);
    },
    // SLDC invoice generated from here
    ViewSLDCChargesData_GST: function(fromDate, toDate, discomVar, discomState,financialYear,signatureJson,fromDateMonthVar,toDateMonthVar,peridFromTo) {
        if (discomVar == 'Rajasthan') {
            var returnDataArr = [];
            var spdNames = [];
            var state = discomState;
            var capacity = 0;
            var discomAddress = Discom.find({
                discom_state: discomState
            }).fetch();
            //finding spd name
            var json = Meteor.users.find({
                _id: discomAddress[0].spdIds[0].spdId
            }).fetch();
            var spdState = json[0].profile.registration_form.spd_state;
            // geting address as well as discom name
            if (discomState == 'Delhi(BRPL)' || discomState == 'Delhi(BYPL)' || discomState == 'Delhi(TPDDL)') {
                var addressJson = {
                    invoice_raised_to : discomAddress[0].invoice_raised_to,
                    discomName: discomAddress[0].nameof_buyingutility,
                    discomShortName: discomAddress[0].discom_short_name,
                    dateOfLTA: discomAddress[0].date_of_amendment_one,
                    dateOfAmendment: discomAddress[0].date_of_amendment_two,
                    address: discomAddress[0].discom_address,
                    address_line_two:discomAddress[0].discom_address_line_two,
                    city: discomAddress[0].discom_city,
                    state: 'Delhi',
                    pin: discomAddress[0].discom_pin,
                    fax: discomAddress[0].discom_fax,
                    name: signatureJson.name,
                    designation: signatureJson.designation,
                    full_form:signatureJson.full_form,
                    phone:signatureJson.phone
                }
                state = 'Delhi';
            } else {
                var addressJson = {
                    invoice_raised_to : discomAddress[0].invoice_raised_to,
                    discomName: discomAddress[0].nameof_buyingutility,
                    discomShortName: discomAddress[0].discom_short_name,
                    dateOfLTA: discomAddress[0].date_of_amendment_one,
                    dateOfAmendment: discomAddress[0].date_of_amendment_two,
                    address: discomAddress[0].discom_address,
                    address_line_two:discomAddress[0].discom_address_line_two,
                    city: discomAddress[0].discom_city,
                    state: discomAddress[0].discom_state,
                    pin: discomAddress[0].discom_pin,
                    fax: discomAddress[0].discom_fax,
                    name: signatureJson.name,
                    designation: signatureJson.designation,
                    full_form:signatureJson.full_form,
                    phone:signatureJson.phone
                }
            }
            // finding rate and capacity
            discomAddress[0].spdIds.forEach(function(item) {
                var userData = Meteor.users.find({
                    _id: item.spdId
                }).fetch();
                if (userData[0].profile.registration_form.spd_state == discomVar) {
                    capacity += Number(userData[0].profile.registration_form.project_capicity);
                }
            });
            var SLDCData = InvoiceCharges.find({state:discomVar,invoice_type:'SLDC_Charges',financial_year:financialYear}).fetch();
            if(SLDCData.length > 0){
              var sldcVarCharges = Number(SLDCData[0].rate);
            }else{
              var sldcVarCharges = Number(1).toFixed(2);
            }
            var fromDateSplit = fromDate.split('-');
            var toDateSplit = toDate.split('-');
            var firstMonth = Number(fromDateSplit[1]);
            var lastMonthWithZero = toDateSplit[1];
            var lastMonth = Number(toDateSplit[1]);
            var loopDataArr = [];
            var grandTotal = 0;
            for (firstMonth; firstMonth <= lastMonth; firstMonth++) {
                var dateArr = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
                var fromDateMonth = getArray(dateArr, Number(firstMonth));
                var createdDate = fromDateMonth + "'" + fromDateSplit[2];
                var totalAmt = Number(capacity) * 1000 * Number(sldcVarCharges);
                grandTotal += totalAmt;
                loopDataArr.push({
                    month: createdDate,
                    amount: totalAmt.toFixed(2)
                });
            }
            //----------using collection for storing invoice no or data-----
            var currentDate = new Date();
            var dateFormat = moment(currentDate).format("DD MMMM YYYY");
            var dateFormatToInsert = moment(currentDate).format('DD-MM-YYYY');
            var myDate = moment().add(30, 'days');
            var duedate = myDate.format('DD-MM-YYYY');
            var dueDateForViewOnly = myDate.format('DD MMMM YYYY');

            var date = new Date();
            var monthInNumber = moment(date).format('MM');
            var YearVar = moment(date).format('YYYY');
            var dateArr = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'];
            var fromDateMonth = getArray(dateArr, fromDateMonthVar);
            var toDateMonth = getArray(dateArr, toDateMonthVar);
            var period = fromDateMonth+'-'+toDateMonth;
            var numberOfGeneration = 1;
            // var checkData = SLDCInvoiceDetails.find({
            //     discom_state: discomState,
            //     year: YearVar,
            //     delete_status:false
            // }, {
            //     sort: {
            //         $natural: -1
            //     },
            //     limit: 1
            // }).fetch();
            // if(checkData.length > 0){
            //   if(checkData[0].month == monthInNumber && checkData[0].year == YearVar){
            //       numberOfGeneration = (Number(checkData[0].numberOfGeneration) + Number(1));
            //   }
            // }
          var referenceNumberVar = "SECI/PT/SLDC/" + discomVar + '/' + state + '/' + YearVar + '/' + period + '/' + Number(numberOfGeneration);
          var invoiceNumberVar = "SECI/" + state + '/' + discomVar + '/SLDC Charges/' + YearVar + '/' + period + '/' + Number(numberOfGeneration);
          var jsonToInsert = {
            reference_number: referenceNumberVar,
            invoice_number: invoiceNumberVar,
            discom_name: discomAddress[0].nameof_buyingutility,
            discom_state: discomState,
            spd_state : 'Rajasthan',
            generation_date: dateFormatToInsert,
            due_date: duedate,
            year: YearVar,
            month: lastMonthWithZero,
            financial_year:financialYear,
            numberOfGeneration: Number(numberOfGeneration),
            sldc_charges: sldcVarCharges,
            project_capicity: capacity,
            total_amount: grandTotal.toFixed(7),
            sldc_charges_from: fromDate,
            sldc_charges_to: toDate,
            type:'SLDC_Charges',
            typeOfInvoice:'SLDC Invoice',
            delete_status:false,
            timestamp: new Date()
          };
        }
        else if (discomVar == 'Gujarat') {
            var returnDataArr = [];
            var capacity = 0;
            var stateForSLDCCharges = discomVar;
            var discomVar = 'Odisha';
            var discomAddress = Discom.find({
                discom_state: discomVar
            }).fetch();
            //finding spd name
            var json = Meteor.users.find({
                _id: discomAddress[0].spdIds[0].spdId
            }).fetch();
            var spdState = json[0].profile.registration_form.spd_state;
            // geting address as well as discom name
            var addressJson = {
                    invoice_raised_to : discomAddress[0].invoice_raised_to,
                    discomName: discomAddress[0].nameof_buyingutility,
                    discomShortName: discomAddress[0].discom_short_name,
                    dateOfLTA: discomAddress[0].date_of_amendment_one,
                    dateOfAmendment: discomAddress[0].date_of_amendment_two,
                    address: discomAddress[0].discom_address,
                    address_line_two:discomAddress[0].discom_address_line_two,
                    city: discomAddress[0].discom_city,
                    state: discomAddress[0].discom_state,
                    pin: discomAddress[0].discom_pin,
                    fax: discomAddress[0].discom_fax,
                    name: signatureJson.name,
                    designation: signatureJson.designation,
                    full_form:signatureJson.full_form,
                    phone:signatureJson.phone
                };
                // finding rate and capacity
            discomAddress[0].spdIds.forEach(function(item) {
                var userData = Meteor.users.find({
                    _id: item.spdId
                }).fetch();
                if (userData[0].profile.registration_form.spd_state == 'Gujarat') {
                    capacity += Number(userData[0].profile.registration_form.project_capicity);
                }
            });
            var SLDCData = InvoiceCharges.find({state:stateForSLDCCharges,invoice_type:'SLDC_Charges',financial_year:financialYear}).fetch();
            if(SLDCData.length > 0){
              var sldcVarCharges = Number(SLDCData[0].rate);
            }else{
              var sldcVarCharges = Number(1).toFixed(2);
            }
            var fromDateSplit = fromDate.split('-');
            var toDateSplit = toDate.split('-');
            var firstMonth = Number(fromDateSplit[1]);
            var lastMonthWithZero = toDateSplit[1];
            var lastMonth = Number(toDateSplit[1]);
            var loopDataArr = [];
            var grandTotal = 0;
            for (firstMonth; firstMonth <= lastMonth; firstMonth++) {
                var dateArr = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
                var fromDateMonth = getArray(dateArr, Number(firstMonth));
                var createdDate = fromDateMonth + "'" + fromDateSplit[2];
                var totalAmt = Number(capacity) * 1000 * Number(sldcVarCharges);
                grandTotal += totalAmt;
                loopDataArr.push({
                    month: createdDate,
                    amount: totalAmt.toFixed(2)
                });
            }
            //----------using collection for storing invoice no or data-----
            var date = new Date();
            var dateFormat = moment(date).format("DD MMMM YYYY");
            var dateFormatToInsert = moment(date).format('DD-MM-YYYY');
            var myDate = moment().add(30, 'days');
            var duedate = myDate.format('DD-MM-YYYY');
            var dueDateForViewOnly = myDate.format('DD MMMM YYYY');

            var monthInNumber = moment(date).format('MM');

            var YearVar = moment(date).format('YYYY');
            var dateArr = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'];
            var fromDateMonth = getArray(dateArr, fromDateMonthVar);
            var toDateMonth = getArray(dateArr, toDateMonthVar);
            var period = fromDateMonth+'-'+toDateMonth;
            var numberOfGeneration = 1;
            // var checkData = SLDCInvoiceDetails.find({
            //     discom_state: discomVar,
            //     year: YearVar,
            //     delete_status:false
            // }, {
            //     sort: {
            //         $natural: -1
            //     },
            //     limit: 1
            // }).fetch();
            // if(checkData.length > 0){
            //   if(checkData[0].month == monthInNumber && checkData[0].year == YearVar){
            //       numberOfGeneration = (Number(checkData[0].numberOfGeneration) + Number(1));
            //   }
            // }
            var referenceNumberVar = "SECI/PT/SLDC/" + discomVar + '/' + 'Gujarat' + '/' + YearVar + '/' + period + '/' + Number(numberOfGeneration);
            var invoiceNumberVar = "SECI/Gujarat/" + discomVar + '/SLDC Charges/' + YearVar + '/' + period + '/' + Number(numberOfGeneration);
            var jsonToInsert = {
              reference_number: referenceNumberVar,
              invoice_number: invoiceNumberVar,
              discom_name: discomAddress[0].nameof_buyingutility,
              discom_state: discomVar,
              spd_state : 'Gujarat',
              generation_date: dateFormatToInsert,
              due_date: duedate,
              year: YearVar,
              month: lastMonthWithZero,
              financial_year:financialYear,
              numberOfGeneration: Number(numberOfGeneration),
              sldc_charges: sldcVarCharges,
              project_capicity: capacity,
              total_amount: grandTotal.toFixed(7),
              sldc_charges_from: fromDate,
              sldc_charges_to: toDate,
              type:'SLDC_Charges',
              typeOfInvoice:'SLDC Invoice',
              delete_status:false,
              timestamp: new Date()
            };
        }
        returnDataArr.push(spdState);
        returnDataArr.push(addressJson);
        returnDataArr.push({
            capacity_kw: Number(capacity * 1000),
            rate: sldcVarCharges,
            capacity_mw: capacity,
            reference_number: referenceNumberVar,
            invoice_number: invoiceNumberVar,
            due_date:dueDateForViewOnly,
        });
        returnDataArr.push(loopDataArr);
        returnDataArr.push({grandTotal:grandTotal.toFixed(2), amount_in_words:amountInWords(grandTotal.toFixed(2))});
        returnDataArr.push(jsonToInsert);
        var jsonData = {
            fromDate : fromDate,
            toDate:toDate,
            peridFromTo:peridFromTo,
            invoiceDate:dateFormat,
            capacity_kw: Number(capacity * 1000),
            rate: sldcVarCharges,
            capacity_mw: capacity,
            reference_number: referenceNumberVar,
            invoice_number: invoiceNumberVar,
            due_date:dueDateForViewOnly,
        };
        var grandTotalJson = {grandTotal:grandTotal.toFixed(2), amount_in_words:amountInWords(grandTotal.toFixed(2))};

        var TodayDateVar = moment().format('DD-MM-YYYY');
        var random = Math.floor((Math.random() * 10000) + 1).toString();
        var pdfFileName = discomVar+'_SC_'+TodayDateVar+'_'+random;
        Meteor.call('GST_RajasthanAndGujaratSLDCInvoiceDocxToPDF',discomVar,spdState, addressJson, jsonData, loopDataArr,grandTotalJson,pdfFileName);
        var path = "/upload/Invoices/SLDCCharges/"+pdfFileName+".pdf";
        var pathDocx = "/upload/Invoices/SLDCCharges/"+pdfFileName+".docx";
        jsonToInsert.file_path = path;
        jsonToInsert.file_path_docx = pathDocx;
        // Insert Query For SLDC Invoice
        SLDCInvoiceDetails.insert(jsonToInsert);
        var ip = this.connection.httpHeaders['x-forwarded-for'];
        var ipArr = ip.split(',');
        var logJson = {
          ip_address : ipArr,
          log_type: discomVar+' SLDC Invoice Generate',
          template_name: 'generateInvoice',
          event_name: 'SLDCChargesBtnView',
          state:discomVar,
          json:jsonToInsert
        }
        var invoiceLog = insertJsonForInvoiceLog(logJson);
        return returnSuccess('SLDC Charges Invoice Generated for '+discomVar+' for the month of '+monthInNumber+"'"+YearVar, path);
    },
    // Rajasthan And Gujarat SLDC Invoice Docx to PDF
    GST_RajasthanAndGujaratSLDCInvoiceDocxToPDF(discomVar,spdState, addressJson, jsonData, loopDataArr,grandTotalJson,pdfFileName) {
        var fs = require('fs');
        var Docxtemplater = require('docxtemplater');
        var filepath = Assets.absoluteFilePath('RajasthanSLDCInvoice.docx');
        var content = fs.readFileSync(filepath, "binary");
        var doc = new Docxtemplater(content);
        doc.setData({
          'referenceNumber':jsonData.reference_number,
          'invoiceNumber':jsonData.invoice_number,
          'invoiceDate':jsonData.invoiceDate,
          'invoiceRaisedTo':addressJson.invoice_raised_to,
          'discomName':addressJson.discomName,
          'discomShortName':addressJson.discomShortName,
          'address':addressJson.address,
          'addressLineTwo':addressJson.address_line_two,
          'city':addressJson.city,
          'state':addressJson.state,
          'pin':addressJson.pin,
          'gst_number':'GST123',
          'psaDate':addressJson.dateOfLTA,
          'name': addressJson.name,
          'designation': addressJson.designation,
          'fullForm': addressJson.full_form,
          'phone': addressJson.phone,
          'periodFrom': jsonData.fromDate,
          'periodTo': jsonData.toDate,
          'periodFromTo': jsonData.peridFromTo,
          'invoiceDateVar':jsonData.invoiceDate,
          'dueDate': jsonData.due_date,
          'rate': jsonData.rate,
          'capacityKW': jsonData.capacity_kw,
          'capacityMW': jsonData.capacity_mw,
          'a1': loopDataArr[0].month,
          'a2': loopDataArr[0].amount,
          'b1': loopDataArr[1].month,
          'b2': loopDataArr[1].amount,
          'c1': loopDataArr[2].month,
          'c2': loopDataArr[2].amount,
          'grandTotal': grandTotalJson.grandTotal,
          'grandTotalInWords': grandTotalJson.amount_in_words,
        });
        doc.render();
        var buffer = doc.getZip().generate({
            type: "nodebuffer"
        });
        fs.writeFileSync(process.env.PWD + '/.uploads/Invoices/SLDCCharges/'+pdfFileName+'.docx', buffer);
        spawn = Npm.require('child_process').spawn;
        console.log("Executing post");
        command = spawn('libreoffice', ['--headless', '--convert-to', 'pdf', process.env.PWD + '/.uploads/Invoices/SLDCCharges/'+pdfFileName+'.docx', '--outdir', process.env.PWD + '/.uploads/Invoices/SLDCCharges']);
        command.stdout.on('data', function(data) {
            console.log('stdout: ' + data);
        });
        command.stderr.on('data', function(data) {
            console.log('stderr: ' + data);
        });
        command.on('exit', function(code) {
            console.log('child process exited with code ' + code);
        });
        // Meteor.setTimeout(function() {
        //     Meteor.call('deleteUploadedFile', process.env.PWD + '/.uploads/Invoices/SLDCCharges/'+pdfFileName+'.docx');
        // }, 4000);
        console.log('Rajasthan & Gujarat SLDC Invoice PDF Generated!');
    },
    //getting discom state for Incentive chrges invoice
    generateIncentiveChargesData_GST: function() {
        var returnArr = [];
        var data = Discom.find({transaction_type:'Inter'}).fetch();
        data.forEach(function(item) {
          item.spdIds.forEach(function(spdDet) {
            if (spdDet.spdState == 'Rajasthan') {
              returnArr.push(item.discom_state);
            }
          });
        });
        var returnData = _.uniq(returnArr);
        return returnSuccess('Success', returnData);
    },
    // Incentive Charges invoice generated from here
    IncentiveChargesData_GST: function(discomVar, financialYear, incentiveRefVar, incentiveRateVar, signatureJson){
        var returnDataArr = [];
        var spdIDArr = [];
        var discomAddress = Discom.find({discom_state:discomVar}).fetch();
        var discomStateVar = '';
        if (discomVar == 'Delhi(BRPL)' || discomVar == 'Delhi(BYPL)' || discomVar == 'Delhi(TPDDL)') {
          discomStateVar = 'Delhi'
        }else {
          discomStateVar = discomAddress[0].discom_state;
        }
        var addressJson = {
            invoice_raised_to : discomAddress[0].invoice_raised_to,
            discomName: discomAddress[0].nameof_buyingutility,
            address: discomAddress[0].discom_address,
            address_line_two:discomAddress[0].discom_address_line_two,
            city: discomAddress[0].discom_city,
            state: discomStateVar,
            pin: discomAddress[0].discom_pin,
            fax: discomAddress[0].discom_fax,
            amendmentDate: discomAddress[0].date_of_amendment_one,
            discom_short_name:discomAddress[0].discom_short_name,
            name: signatureJson.name,
            designation: signatureJson.designation,
            full_form:signatureJson.full_form,
            phone:signatureJson.phone
        }
        var capacity = 0;
        var spdStateArr = [];
        discomAddress[0].spdIds.forEach( function(item){
          if(item.transaction_type == 'Inter'&& item.spdState == 'Rajasthan'){
            var userData = Meteor.users.find({_id:item.spdId}).fetch();

            spdStateArr.push({spd_state:item.spdState});
            var data = userData[0].profile.registration_form.project_capicity;
            capacity = Number(capacity) + Number(data);
          }else{
            var userData = [];
          }
        });
        var currentDate = new Date();
        var dateFormat = moment(currentDate).format("DD MMMM YYYY");
        var dateFormatToInsert = moment(currentDate).format('DD-MM-YYYY');
        var myDate = moment().add(30, 'days');
        var duedate = myDate.format('DD-MM-YYYY');
        var dueDateForViewOnly = myDate.format('DD MMMM YYYY');
        var currentYear = moment(currentDate).format("YYYY");
        var dataJson = {
            sn: 1,
            discription: 'Incentive Charges',
            capacity:Number(capacity * 1000),
            rate: Number(incentiveRateVar),
            formula:"(MW*"+Number(incentiveRateVar)+"*1000)*Month*(99.75%-98%)/98%",
            amount: Number((Number(capacity) * Number(incentiveRateVar) * 1000) * 12 * (99.75 - 98)/98).toFixed(2)
        };
        var formulaVar = "(MW*"+Number(incentiveRateVar).toFixed(2)+"*1000)*Month*(99.75%-98%)/98%";
        var grandTotal = Number((Number(capacity) * Number(incentiveRateVar) * 1000) * 12 * (99.75 - 98)/98).toFixed(2);
        var roundTotal = Number(grandTotal).toFixed(0);
        var amountInCommanVar = amountInComman(Number(roundTotal).toFixed(2));

        var checkData = IncentiveChargesDetail.find({discom_state:discomVar,financial_year:financialYear, delete_status:false}, {sort: {$natural: -1},limit: 1}).fetch();
        var numberOfGeneration = 1;
        if(checkData.length > 0){
            numberOfGeneration = (Number(checkData[0].numberOfGeneration) + Number(1));
        }
        var monthVar = moment().format('MM');
        var splitFinancialYear = financialYear.split("-");
        var incenive_period_from = '01 April '+splitFinancialYear[0];
        var incenive_period_to = '31 March '+splitFinancialYear[1];
        var referenceNumberVar = "SECI/PT/Power Trading/Incentive Charges/"+currentYear+'/'+ Number(numberOfGeneration);
        var invoiceNumberVar = "SECI/" + discomVar + '/' + spdStateArr[0].spd_state + '/Incentive Charges/FY ' + financialYear + '/' + Number(numberOfGeneration);
        var jsonToInsert = {
          reference_number: referenceNumberVar,
          invoice_number: invoiceNumberVar,
          discom_name: discomAddress[0].nameof_buyingutility,
          discom_state: discomVar,
          generation_date: dateFormatToInsert,
          due_date: duedate,
          financial_year:financialYear,
          numberOfGeneration: Number(numberOfGeneration),
          reference_data:incentiveRefVar,
          formula_used:formulaVar,
          period_from:incenive_period_from,
          period_to:incenive_period_to,
          rate_per_unit: incentiveRateVar,
          capacity:Number(capacity * 1000),
          incentive_charges: grandTotal,
          action_date:dateFormatToInsert,
          month : monthVar,
          type:'Incentive_Charges',
          typeOfInvoice:'Incentive Invoice',
          delete_status:false,
          timestamp: new Date()
        };
        var coverJson = {reference_number:referenceNumberVar,invoice_number:invoiceNumberVar,capacity:capacity,currentDate:dateFormat,due_date:duedate,ref:incentiveRefVar,financial_year:financialYear,incentive_charges:grandTotal, amount_inComman:amountInCommanVar, amount_inwords:amountInWords(Number(roundTotal).toFixed(2))};
        var InvoiceJson = {invoice_number:invoiceNumberVar,currentDate:dateFormat,due_date:duedate,dataJson:dataJson,period_from:incenive_period_from,period_to:incenive_period_to,incentive_charges:Number(grandTotal).toFixed(0), amount_inComman:amountInCommanVar, amount_inwords:amountInWords(Number(roundTotal).toFixed(2))};
        var returnJson = {coverJson:coverJson,InvoiceJson:InvoiceJson,addressJson:addressJson};
        var returnDataJson = {returnJson:returnJson,jsonToInsert:jsonToInsert};

        var TodayDateVar = moment().format('DD-MM-YYYY');
        var random = Math.floor((Math.random() * 10000) + 1).toString();
        var pdfFileName = discomVar+'_IC_'+TodayDateVar+'_'+random;
        Meteor.call('GST_RajasthanIncentiveInvoiceDocxToPDF',discomVar,addressJson, coverJson, InvoiceJson, pdfFileName);
        var path = "/upload/Invoices/IncentiveCharges/"+pdfFileName+".pdf";
        var pathDocx = "/upload/Invoices/IncentiveCharges/"+pdfFileName+".docx";
        jsonToInsert.file_path = path;
        jsonToInsert.file_path_docx = pathDocx;
        // Insert Query For Incentive Invoice
        IncentiveChargesDetail.insert(jsonToInsert);
        var ip = this.connection.httpHeaders['x-forwarded-for'];
        var ipArr = ip.split(',');
        var logJson = {
          ip_address : ipArr,
          log_type: discomVar+' Incentive Invoice Generated',
          template_name: 'generateInvoice',
          event_name: 'IncentiveBtnSubmit',
          state:discomVar,
          json:jsonToInsert
        }
        var invoiceLog = insertJsonForInvoiceLog(logJson);
      return returnSuccess('Incentive Charges Invoice Generated',path);
    },
    // Rajasthan Incentive Invoice Docx to PDF
    GST_RajasthanIncentiveInvoiceDocxToPDF(discomVar,addressJson, coverJson, InvoiceJson, pdfFileName) {
        var fs = require('fs');
        var Docxtemplater = require('docxtemplater');
        var filepath = Assets.absoluteFilePath('RajasthanIncentiveInvoice.docx');
        var content = fs.readFileSync(filepath, "binary");
        var doc = new Docxtemplater(content);
        doc.setData({
          'referenceNumber':coverJson.reference_number,
          'invoiceNumber':coverJson.invoice_number,
          'invoiceDate':coverJson.currentDate,
          'capacityMW': coverJson.capacity,
          'dueDate': coverJson.due_date,
          'ref': coverJson.ref,
          'financialYear': coverJson.financial_year,
          'incentive_charges': coverJson.incentive_charges,
          'amountInComman': coverJson.amount_inComman,
          'amountInWords': coverJson.amount_inwords,
          'invoiceRaisedTo':addressJson.invoice_raised_to,
          'discomName':addressJson.discomName,
          'discomShortName':addressJson.discom_short_name,
          'address':addressJson.address,
          'addressLineTwo':addressJson.address_line_two,
          'city':addressJson.city,
          'state':addressJson.state,
          'pin':addressJson.pin,
          'gst_number':'GST123',
          'psaDate':addressJson.amendmentDate,
          'name': addressJson.name,
          'designation': addressJson.designation,
          'fullForm': addressJson.full_form,
          'phone': addressJson.phone,
          'periodFrom': InvoiceJson.period_from,
          'periodTo': InvoiceJson.period_to,
          'rate': InvoiceJson.dataJson.rate,
          'capacityKW': InvoiceJson.dataJson.capacity,
          'formula': InvoiceJson.dataJson.formula,
        });
        doc.render();
        var buffer = doc.getZip().generate({
            type: "nodebuffer"
        });
        fs.writeFileSync(process.env.PWD + '/.uploads/Invoices/IncentiveCharges/'+pdfFileName+'.docx', buffer);
        spawn = Npm.require('child_process').spawn;
        console.log("Executing post");
        command = spawn('libreoffice', ['--headless', '--convert-to', 'pdf', process.env.PWD + '/.uploads/Invoices/IncentiveCharges/'+pdfFileName+'.docx', '--outdir', process.env.PWD + '/.uploads/Invoices/IncentiveCharges']);
        command.stdout.on('data', function(data) {
            console.log('stdout: ' + data);
        });
        command.stderr.on('data', function(data) {
            console.log('stderr: ' + data);
        });
        command.on('exit', function(code) {
            console.log('child process exited with code ' + code);
        });
        // Meteor.setTimeout(function() {
        //     Meteor.call('deleteUploadedFile', process.env.PWD + '/.uploads/Invoices/IncentiveCharges/'+pdfFileName+'.docx');
        // }, 4000);
        console.log('Rajasthan Incentive Invoice PDF Generated!');
    },
});



function amountInWords(amount){
  var changeWord = amount;
  if(changeWord < 0){
     changeWord = Number(-(amount)).toFixed(2);
  }
  var newChange = changeWord.split(".");
  var amountData = '';
  if (newChange[1] != "00") {
      var data1 = inWords(newChange[0]);
      var data2 = inWords(newChange[1]);
      amountData = data1 + ' ' + "and" + ' ' + data2 + ' ' + "Paisa only";
  } else {
      var data1 = inWords(newChange[0]);
      amountData = data1+ "only";
  }
  return amountData;
};

function inWords(num) {
    var a = ['', 'One ', 'Two ', 'Three ', 'Four ', 'Five ', 'Six ', 'Seven ', 'Eight ', 'Nine ', 'Ten ', 'Eleven ', 'Twelve ', 'Thirteen ', 'Fourteen ', 'Fifteen ', 'Sixteen ', 'Seventeen ', 'Eighteen ', 'Nineteen '];
    var b = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];
    if ((num = num.toString()).length > 9) return 'overflow';
    n = ('000000000' + num).substr(-9).match(/^(\d{2})(\d{2})(\d{2})(\d{1})(\d{2})$/);
    if (!n) return;
    var str = '';
    str += (n[1] != 0) ? (a[Number(n[1])] || b[n[1][0]] + ' ' + a[n[1][1]]) + 'Crore ' : '';
    str += (n[2] != 0) ? (a[Number(n[2])] || b[n[2][0]] + ' ' + a[n[2][1]]) + 'Lakh ' : '';
    str += (n[3] != 0) ? (a[Number(n[3])] || b[n[3][0]] + ' ' + a[n[3][1]]) + 'Thousand ' : '';
    str += (n[4] != 0) ? (a[Number(n[4])] || b[n[4][0]] + ' ' + a[n[4][1]]) + 'Hundred ' : '';
    str += (n[5] != 0) ? ((str != '') ? '' : '') + (a[Number(n[5])] || b[n[5][0]] + ' ' + a[n[5][1]]) : '';
    return str;
};

function amountInComman(data){
  var x = data;
     var returnData = x.toString().replace(/,/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ",");
     return returnData;
};

function difference(d1, d2) {
  var m = moment(d1);
  var years = m.diff(d2, 'years');
  m.add(-years, 'years');
  var months = m.diff(d2, 'months');
  m.add(-months, 'months');
  var days = m.diff(d2, 'days');
  return Number(months) + 1;
}

function getArray(ary, month) {
    return ary[month - 1];
};

changeDateFormatAsRequired = function(raisedDate) {
  var newDate = raisedDate.split("-");
  var myObject = new Date(newDate[2], newDate[1] - 1, newDate[0]);
  var result = moment(myObject).format('DD MMMM YYYY ');
  return result;
};

insertJsonForInvoiceLog = function(json) {
  var currentDate = new Date();
  json.user_id = Meteor.userId();
  json.user_name = Meteor.user().username;
  json.timestamp = currentDate;
  json.action_date = moment(currentDate).format('DD-MM-YYYY');
  var result =  LogDetails.insert(json);
  return result;
}
