global with sharing class TestController {


    @AuraEnabled(cacheable=true)
    global static List<sobject> getRecords(String query){
        try {
            if(query == null || String.isBlank(query)){
                return null;
            }
            query = query.trim();
            return Database.query(query);
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }

    @AuraEnabled
    global static List<sobject> performDML(List<sobject> items, String query, String dmlOperationType){
        try {
            if(dmlOperationType.toLowerCase() == 'delete'){
                delete items;
            }
            else if(dmlOperationType.toLowerCase() == 'update'){
                update items; 
            }
            return getRecords(query);
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }
    
}
