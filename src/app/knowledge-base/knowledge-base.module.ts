import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { KnowledgeBaseComponent } from "./knowledge-base.component";


@NgModule({
declarations:[
 //LoginComponent
],
imports:[
RouterModule.forChild([
    {path: 'kb', component:KnowledgeBaseComponent}
])
]
})
export class KnowledgeBaseModule {}