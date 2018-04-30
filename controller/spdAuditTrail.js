Template.spdAuditTrail.onCreated(function ss() {
  this.spdListArr = new ReactiveVar;
  this.spdChangeRequestDetail = new ReactiveVar;
});

Template.spdAuditTrail.rendered =  function(){
  var instance = Template.instance();
  SessionStore.set("isLoading", true);
  Meteor.call("gettigSPDListForAudit", function(error, result) {
      if (error) {
          SessionStore.set("isLoading", false);
          swal("Oops...", "Please try again!", "error");
      } else {
          if (result.status) {
              var jsonGot = result.data;
              // sorting SPD Name, Alphabetically in array
              var ar = jsonGot.sort(function(a, b) {
                  var nA = a.profile.registration_form.name_of_spd.toLowerCase();
                  var nB = b.profile.registration_form.name_of_spd.toLowerCase();
                  if (nA < nB)
                      return -1;
                  else if (nA > nB)
                      return 1;
                  return 0;
              });
              instance.spdListArr.set(ar);
              SessionStore.set("isLoading", false);
          }
      }
  });
};

Template.spdAuditTrail.events({
  'change #selectUserSpd': function (e, instance) {
    var spdId = $(e.currentTarget).val();
    if (spdId != '') {
      SessionStore.set("isLoading", true);
      Meteor.call("gettigSPDChangeRequestDetail",spdId, function(error, result) {
          if (error) {
              SessionStore.set("isLoading", false);
              swal("Oops...", "Please try again!", "error");
          } else {
              if (result.status) {
                  instance.spdChangeRequestDetail.set(result.data);
                  SessionStore.set("isLoading", false);
              }else {
                instance.spdChangeRequestDetail.set();
                SessionStore.set("isLoading", false);
                swal(result.message);
              }
          }
      });
    }else {
      instance.spdChangeRequestDetail.set();
    }
  },
  'click #exportAuditTrail': function(e, instance) {
    var spdName = $('#selectUserSpd').find(':selected').attr("attrName");
    tableToExcel('spdAuditTrailTbl', 'SHEET1', spdName);
  }
});

Template.spdAuditTrail.helpers({
  spdListHelper(){
    if (Template.instance().spdListArr.get()) {
      return Template.instance().spdListArr.get();
    }else {
      return false;
    }
  },
  dataShow(){
    if (Template.instance().spdChangeRequestDetail.get()) {
      return Template.instance().spdChangeRequestDetail.get();
    }else {
      return false;
    }
  },
  serial(index){
    return index+1;
  }
});


var tableToExcel = (function() {
    var uri = 'data:application/vnd.ms-excel;base64,',
        template = '<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40"><head><!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>{worksheet}</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]--></head><body><table>{table}</table></body></html>',
        base64 = function(s) {
            return window.btoa(unescape(encodeURIComponent(s)))
        },
        format = function(s, c) {
            return s.replace(/{(\w+)}/g, function(m, p) {
                return c[p];
            })
        }
    return function(table, name, spdName) {
        if (!table.nodeType)
            table = document.getElementById(table)
        var ctx = {
            worksheet: name || 'Worksheet',
            table: table.innerHTML
        }
        // dynamic name in excelname
        var excelname = spdName+"_audit_trail_"+".xls";
        var link = document.createElement("A");
        link.href = uri + base64(format(template, ctx))
        link.download = excelname || 'Workbook.xls';
        link.target = '_blank';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
})()
