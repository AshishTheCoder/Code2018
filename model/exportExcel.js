Meteor.methods({
  getStateList(reportType, selctedDate){
    var data = ExcelDetails.find({date:selctedDate,reportType:reportType}).fetch();
    var stateArr = [];
    if (reportType == 'SLDC') {
      _.forEach(data, function(item) {
        stateArr.push(item.state);
      });
    }else {
      _.forEach(data, function(item) {
        stateArr.push(item.state);
      });
    }
    if (stateArr.length > 0) {
      return returnSuccess('Getting Uniq State List',_.uniq(stateArr));
    }else {
      return returnFaliure(reportType+' Report not generated for '+selctedDate);
    }
  },
  getExcelRevisionNumber(reportType, selctedDate, state){
    var revisionArr = [];
    var data = ExcelDetails.find({date:selctedDate,reportType:reportType,state:state}).fetch();
    _.forEach(data, function(item) {
      revisionArr.push(item.revision_number);
    });
    return returnSuccess('Getting revision no for export excel',_.uniq(revisionArr));
  },
  getGeneratedExcel(selctedDate,reportType,state,revisionNo){
    var dataArr = [];
    var data = ExcelDetails.find({date:selctedDate,reportType:reportType,state:state,revision_number:Number(revisionNo)}).fetch();
    _.forEach(data, function(item) {
      var json = {_id:item._id,revision_number:item.revision_number,fileName:item.fileName,state:item.state,showHref:'/upload/'+item.filePath};
      dataArr.push(json);
    });
    return returnSuccess('Getting Generated Excel Detail to Export',dataArr);
  }
});
