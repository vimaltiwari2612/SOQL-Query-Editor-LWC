public with sharing class SearchController {

    @AuraEnabled(cacheable= true)
    public static List<Result> search(String text) {
        if(text == null || String.isBlank(text)) throw new AuraHandledException('Searched Text Can\'t be Blank!!');
        try{
            return convertToResult(findText(text));
        }catch(Exception e){
            throw e;
        }
    }

    private static List<List<Sobject>> findText(String text){
        //create sosl
        String sosl = 'FIND \''+text+'\' IN ALL FIELDS RETURNING ACCOUNT(NAME), CONTACT(Name,LASTNAME) WITH SPELL_CORRECTION = true';
        System.debug(sosl);
        return Search.query(sosl);
    }

    private static List<Result> convertToResult(List<List<Sobject>> searchResult){
        List<Result> toBeReturned = new List<Result>();
        for(List<Sobject> records : searchResult){
            System.debug(records);
            if(records.size() > 0){
                toBeReturned.add(new Result(records));
            }
        }
        for(Result r: toBeReturned){
            System.debug(r.toString());
        }
        return toBeReturned;
    }

    //wrapper class for SOSL results
    public class Result{
        @AuraEnabled
        public String objectName;
        @AuraEnabled
        public List<Sobject> records;

        public Result(List<Sobject> records){
           
            this.records = records;
            this.objectName = this.getName(records.get(0));
        }

        public String getName(Sobject obj){
            return obj.Id.getSObjectType().getDescribe().getName();
        }

        public override String toString(){
            return this.objectName+ ' '+ this.records;
        }
    }
}


