import React from 'react';
import config from 'src/config';
import FormTiny from 'src/components/forms/form-tiny';
import FormDefault from 'src/components/forms/form-default';
import { notify } from 'src/utils/common';

type FormPropTypes = {
  type: 'tiny' | 'default';
  fields: Field[];
  title?: string;
  btnText?: string;
}

export default class Form extends React.Component<FormPropTypes, FormState> {
  protected constructor(props: FormPropTypes) {
    super(props);

    this.state = {
      values: props.fields.reduce((carry, field) => {
        carry[field.name] = field.value;
        return carry;
      }, {}),
      errors: props.fields.reduce((carry, field) => {
        carry[field.name] = '';
        return carry;
      }, {}),
      success: false
    };

    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
  }

  handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    let resetForm = () => {
      setTimeout(() => {
        const values = { ...this.state.values };
        const errors = { ...this.state.errors };
        Object.keys(values).map(name => values[name] = '');
        Object.keys(errors).map(name => errors[name] = '');
        this.setState({ errors, values, success: false });
      }, 200);
    };

    if (!Object.values(this.state.values).every(x => (x !== null && x !== ''))) {
      let errors = {};
      Object.keys(this.state.values).filter(v => !this.state.values[v]).forEach(emptyKey => {
        errors[emptyKey] = 'required';
        this.setState({ errors });
      });
    } else {
      const data: FormData = new FormData;
      data.append('to', config.form.to);
      data.append('subject', config.form.subject);
      Object.keys(this.state.values).map(name => data.append(name, this.state.values[name]));

      fetch(config.form.apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
        },
        body: new URLSearchParams(data as any).toString()
      }).then(() => {
        this.setState({
          success: true
        });

        notify(config.form.successMsg);
        resetForm();
      });
    }
  }

  handleInputChange(e: React.FormEvent<HTMLInputElement>) {
    this.setState({
      values: { ...this.state.values, [e.currentTarget.name]: e.currentTarget.value },
    });

    let errors = { ...this.state.errors };
    errors[e.currentTarget.name] = '';
    this.setState({ errors });
  }

  render() {
    return <>
      {
        this.props.type === 'tiny'
          ? <FormTiny
            handleSubmit={this.handleSubmit}
            handleInputChange={this.handleInputChange}
            fields={this.props.fields} state={this.state}/>
          : ''
      }
      {this.props.type === 'default'
        ? <FormDefault
          handleSubmit={this.handleSubmit}
          handleInputChange={this.handleInputChange}
          btnText={this.props.btnText}
          fields={this.props.fields} state={this.state}/>
        : ''
      }
    </>;
  }
}
