import { LightningElement , track  } from 'lwc';
import getRecords from '@salesforce/apex/TestController.getRecords';
import performDML from '@salesforce/apex/TestController.performDML';

export default class Testcomponent extends LightningElement {

    @track columns = [];
    @track dataList = [];
    @track draftValues = [];
    @track query; 
    @track showSpinner;
    @track count;
    @track selectedRows = [];

    handleSave(event){
        this.draftValues = event.detail.draftValues;
    }

    doDML(records, operationType){
        console.log('Performing '+operationType+' on '+JSON.stringify(records));
        performDML({items: records,query:this.query ,dmlOperationType :operationType}).then(data =>{
            this.setDataList(JSON.parse(JSON.stringify(data)));
            this.showSpinner = false;
            this.selectedRows = [];
            this.draftValues = [];
        }).catch(error=> {
            alert(operationType+' failed '+error);
        });
    }

    updateRecords(event){
        console.log(this.draftValues);
        if(this.draftValues.length == 0){
            alert('No records to update.');
            return;
        }
        this.showSpinner = true;
        this.doDML(this.draftValues,'update');
    }

    changeQuery(event){
        this.query = event.detail.value;
    }

    deleteRecords(event){
        console.log(this.selectedRows);
        if(this.selectedRows.length == 0){
            alert('No records selected for deletion.');
            return;
        }
        this.showSpinner = true;
        this.doDML(this.selectedRows,'delete');
    }

    handleSelection(event) {
        this.selectedRows = [];
        const selectedRows = event.detail.selectedRows;
        // Display that fieldName of the selected rows
        for (let i = 0; i < selectedRows.length; i++){
            this.selectedRows.push(selectedRows[i]);
        }
    }

    search(event){
        if(this.query === null || this.query === undefined){
            alert('Enter a Query');
            return;
        }
        if(this.isValidQuery()){
            console.log('inisde ');
            this.showSpinner = true;
            this.columns = this.getColumns();
            this.fetchData();
        }
    }

    fetchData(){
        getRecords({query : this.query}).then(data => {
            this.setDataList(JSON.parse(JSON.stringify(data)));
            this.showSpinner = false;
        }).catch(error=> {
            alert('Search failed '+error);
            this.showSpinner = false;
        });
    }

    setDataList(results){
        this.dataList = results;
        this.count = this.dataList.length;
    }

    isValidQuery(){
        //validations for query
       return true;
    }

    getColumns(){
        var selectIndex = this.query.toUpperCase().indexOf('SELECT') + 6;
        var fromIndex = this.query.toUpperCase().indexOf('FROM');
        var fields = this.query.substring(selectIndex,fromIndex).trim().split(',');
        var cols = [];
        for(var item in fields){
            var c = new Object();
            var i = this.getLabel(fields[item]);
            c.label = i;
            c.fieldName = i;
            c.editable = this.isEditable(i);
            cols.push(c);
        }
        return cols;
    }

    isEditable(item){
        if(!item.endsWith("__c")){
            return "true";
        }
        return "true";
    }
   
    getLabel(item){
        item = item.trim();
        if(item.endsWith("__c")){
            var leftString = item.substring(item.indexOf("__")+2);
            var arr = leftString.toLowerCase().split("_");
            var finalStr = item.substring(0,item.indexOf("__")+2);
            
            for(var i = 0; i < arr.length -2 ; i++){
                var element = arr[i].trim();
                element = element.charAt(0).toUpperCase() + element.substring(1);
                finalStr += element +"_";
            }
            item = finalStr + "_"+ arr[arr.length-1];
        }
        else{
            item = item.charAt(0).toUpperCase() + item.substring(1);
        }
        return item;
    }
}