import { LightningElement, track } from 'lwc';
import search from '@salesforce/apex/SearchController.search';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

export default class SearchComponent extends LightningElement {

   
    @track searchQuery = null;
    @track searchResults = null;
    @track showResults = false;

    inputChange(event){
        this.searchQuery = event.detail.value;
    }

    getResults(query){
        search({text:query}).then(data =>{
           
            this.searchResults = JSON.parse(JSON.stringify(data));
            console.log('Searched Result : '+this.searchResults);
            this.showResults = true;
            this.dispatchEvent(new ShowToastEvent({
                title: 'Success',
                message: 'Search Completed.',
                variant: 'Success'
            }));
        }).catch(errors =>{
            this.searchQuery = null;
            this.dispatchEvent(new ShowToastEvent({
                title: 'Error',
                message: errors,
                variant: 'error'
            }));
            this.showResults = false;
        });
    }

    handleClick(event){
        if(this.searchQuery == null || this.searchQuery == undefined || this.searchQuery.trim() == ""){
            this.dispatchEvent(new ShowToastEvent({
                title:'Error',
                message: 'Search text needed',
                variant: 'error'
            }));
            this.showResults = false;
            return;
        }
        console.log('Searching Query '+this.searchQuery);
        this.getResults(this.searchQuery);
    }



}