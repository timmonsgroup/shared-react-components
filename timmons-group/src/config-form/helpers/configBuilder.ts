// import { DataField, FieldType } from "../types/fields.model";

// class ConfigBuilder {
//   private config: any;
//   private sections: any;

//   constructor() {
//     this.config = {};
//   }

//   form(name: string): this {
//     this.config.form = { name };
//     return this;
//   }

//   field(name: string, type: DataField | FieldType): this {

//     if (!this.config.form) {
//       throw new Error('Form must be defined before adding fields');
//     }

//     if (!this.config.form.fields) {
//       this.config.form.fields = [];
//     }

//     // check if field already exists and throw error if it does
//     const field = this.config.form.fields.find((field: any) => field.name === name);
//     if (field) {
//       console.log(`Field with name ${name} already exists. See: `, field);
//     }

//     this.config.form.fields.push({ name, type });
//     return this;
//   }

//   createSection(id:string, name: string): this {
//     if (!this.config.form) {
//       throw new Error('Form must be defined before adding sections');
//     }

//     if (!this.config.form.sections) {
//       this.config.form.sections = [];
//     }

//     this.config.form.sections.push({ name });
//     return this;
//   }

//   addSectionCondition(sectionId: string, condition: any): this {
//     if (!this.config.form) {
//       throw new Error('Form must be defined before adding sections');
//     }

//     if (!this.config.form.sections) {
//       this.config.form.sections = [];
//     }

//     const section = this.config.form.sections.find((section: any) => section.id === sectionId);

//     if (!section) {
//       throw new Error(`Section with id ${sectionId} not found`);
//     }

//     if (!section.conditions) {
//       section.conditions = [];
//     }

//     section.conditions.push(condition);
//     return this;
//   }

//   build(): any {
//     if (!this.config.form) {
//       throw new Error('Form must be defined');
//     }

//     return this.config;
//   }
// }

// export default ConfigBuilder;

// const configBuilder = new ConfigBuilder();

// configBuilder
//   .form('myForm')
//   .field('name', 'text')
//   .field('email', 'email');

// const config = configBuilder.build();
// console.log(config);
