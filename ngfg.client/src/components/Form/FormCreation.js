import React, {Component} from 'react';
import axios from 'axios';

import FormControl from '@material-ui/core/FormControl';
import {TextField} from "@material-ui/core";
import Button from "@material-ui/core/Button";
import FormFieldCreate from "./AdditionalComponent/FormFieldCreate";
import FormFieldCreationList from "./AdditionalComponent/FormFieldCreationList";

const API_URL = 'http://ngfg.com:8000/api';
const API_VERSION = 'v1';

class FormCreation extends Component {
    state = {
        "formId": undefined,
        "name": undefined,
        "title": undefined,
        "resultUrl": undefined,
        "isPublished": false,
        "formField": {},
        "formFields": []
    }

    handleNameChange = (event) => {
        this.setState({
            name: event.target.value
        });
    }

    handleTitleChange = (event) => {
        this.setState({
            title: event.target.value
        });
    }

    handleResultUrlChange = (event) => {
        this.setState({
           resultUrl: event.target.value
        });
    }

    handlePublish = () => {
        this.setState({
            isPublished: true
        }, this.saveForm);
    }

    saveFormFields = (formId, formField) => {
        axios.post(`${API_URL}/${API_VERSION}/forms/${formId}/fields/`, {
            fieldId: formField.fieldId,
            question: formField.question,
            position: formField.position
        },
            {withCredentials: true})
            .then ( res => {
                console.log(res);
                }
            )
            .catch(error => {
                console.log(error);
                }
            )
    }

    saveForm = () => {
        axios.post(`${API_URL}/${API_VERSION}/forms/`, {
                name: this.state.name,
                title: this.state.title,
                resultUrl: this.state.resultUrl,
                isPublished: this.state.isPublished
            },
            {withCredentials: true})
            .then( res => {
                    const formId = res.data.id;
                    Object.entries(this.state.formFields).map(([key, value]) => (
                        this.saveFormFields(formId, value)
                    ));
                }
            )
            .catch ( error => {
                console.log(error);
                }
            );
    }

    addField = (fieldId, position, question) => {
        let formField = {fieldId: fieldId, position: position, question: question}
        let formFields = this.state.formFields;
        formFields[position] = formField;
        this.setState({formFields});
    }

    handleFieldRemoval = (position) => {
        this.props.removeField(position);
}

    render() {
        return(
            <div className="form-container">
                <FormControl>
                    <div className="form-btn-container">
                        <Button onClick={this.handlePublish}
                                className="form-creation-btn"
                        >
                            Save & Publish
                        </Button>
                        <Button onClick={this.saveForm}
                                className="form-creation-btn"
                        >
                            Save
                        </Button>
                    </div>

                    <div className="form-creation-card">
                            <TextField
                            id="form-name"
                            className="form-creation-fields"
                            variant="outlined"
                            helperText="Enter Form Name"
                            type="text"
                            onChange={this.handleNameChange}
                        />
                        <TextField
                            className="form-creation-fields"
                            variant="outlined"
                            helperText="Enter Form Title"
                            size="small"
                            margin="dense"
                            type="text"
                            onChange={this.handleTitleChange}
                        />
                        <TextField
                            className="form-creation-fields"
                            variant="outlined"
                            helperText="Link Result URL"
                            size="small"
                            margin="dense"
                            type="url"
                            onChange={this.handleResultUrlChange}
                        />
                        <FormFieldCreationList fields={this.props.addedFields}
                                               addField={this.addField}
                                               handleFieldRemoval={this.handleFieldRemoval}
                        />
                        <div>
                        </div>
                    </div>

                </FormControl>
            </div>
        )
    }
}

export default FormCreation;