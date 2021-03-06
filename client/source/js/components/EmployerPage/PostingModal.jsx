import React, {Component} from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import moment from 'moment';
import { empModalHandleChng } from 'actions/EmployerPage/ControlBar';

@connect(state => ({
  modals: state.empControlBar.get('modals'),
  offices: state.empControlBar.get('offices'),
  modalValues: state.empControlBar.get('modalValues')
}))

export default class PostingModal extends Component {
  static propTypes = {
    modals: PropTypes.object,
    offices: PropTypes.array,
    modalValues: PropTypes.object,
    toggleModal: PropTypes.func,
    dispatch: PropTypes.func
  }

  constructor() {
    super();
    this._handleChange = this._handleChange.bind(this);
    this._handleDateChange = this._handleDateChange.bind(this);
    this._renderDateSelectors = this._renderDateSelectors.bind(this);
    this._renderModalBody = this._renderModalBody.bind(this);
    this._handleSubmit = this._handleSubmit.bind(this);
  }

  _handleChange(event) {
    this.props.dispatch(empModalHandleChng(event));
  }

  _handleDateChange(name, value) {
    const event = {
      target: { name, value }
    };
    this._handleChange(event);
  }

  _renderDateSelectors() {
    const { dates, type, startDate, endDate } = this.props.modalValues;
    if (type === 'FT' || type === 'PT') {
      return (
        <div className='field'>
          <div className='control'>
            <label className='label'>
              Start Date:
            </label>
            <DatePicker
              selected={startDate}
              selectsStart
              inline
              placeholderText='Pick start date'
              minDate={moment()}
              maxDate={moment().add(6, 'months')}
              startDate={startDate}
              endDate={null}
              disabledKeyboardNavigation
              onChange={value => this._handleDateChange('startDate', value)}
            />
          </div>
        </div>
      );
    } else {
      return (
        <div className='columns'>
          <div className='field column is-6'>
            <div className='control'>
              <label className='label'>
                Start Date:
              </label>
              <DatePicker
                selected={startDate}
                selectsStart
                inline
                placeholderText='Pick start date'
                minDate={moment()}
                maxDate={moment().add(6, 'months')}
                startDate={startDate}
                endDate={endDate || startDate}
                disabledKeyboardNavigation
                onChange={value => this._handleDateChange('startDate', value)}
              />
            </div>
          </div>
          <div className='field column is-6'>
            <div className='control'>
              <label className='label'>
                End Date:
              </label>
              <DatePicker
                selected={endDate}
                selectsStart
                inline
                placeholderText='Pick start date'
                minDate={moment()}
                maxDate={moment().add(6, 'months')}
                startDate={startDate}
                endDate={endDate || startDate}
                disabledKeyboardNavigation
                onChange={value => this._handleDateChange('endDate', value)}
              />
            </div>
          </div>
        </div>
      );
    }
  }

  _renderModalBody() {
    const { offices, modalValues } = this.props;

    if (modalValues.action) {
      return (
        <section className='modal-card-body'>

          <div className='columns'>
            <div className='field column is-6'>
              <div className='control'>
                <label className='label'>
                  Select Office Location:
                </label>
                <span className='select'>
                  <select name='officeId' defaultValue={modalValues.officeId} onChange={this._handleChange}>
                    <option value=''>-</option>
                    { offices.map(office => <option key={office.id} value={office.id}>{office.name}</option> ) }
                  </select>
                </span>
              </div>
            </div>

            <div className='field column is-6'>
              <div className='control'>
                <label className='label'>
                  Posting Type:
                </label>
                <span className='select'>
                  <select name='type' defaultValue={modalValues.type} onChange={this._handleChange}>
                    <option value=''>-</option>
                    <option value='Temp'>Temporary / Relief</option>
                    <option value='PT'>Permanent Part-Time</option>
                    <option value='FT'>Permanent Full-Time</option>
                  </select>
                </span>
              </div>
            </div>
          </div>

          <div className='field'>
            <label className='label'>
              Position Title:
            </label>
            <div className='control'>
              <input
                className='input'
                type='text'
                name='title'
                defaultValue={modalValues.title}
                placeholder='Example: Temporary Dental Assistant'
                onChange={this._handleChange} />
            </div>
          </div>

          { this._renderDateSelectors() }

          <div className='field'>
            <label className='label'>
              Position Description and Requirements:
            </label>
            <p className='control'>
              <textarea
                className='textarea'
                name='description'
                defaultValue={modalValues.description}
                placeholder='Example: blah blah blah blah blah'
                onChange={this._handleChange} />
            </p>
          </div>

        </section>

      );
    } else {
      return (
        <section className='modal-card-body'>
          <p className='page-msg'>
            <i className='fa fa-spinner fa-spin fa-3x fa-fw'></i>
            <span className='sr-only'>Loading...</span>
          </p>
        </section>
      );
    }

  }

  _validateForm() {
    return true;
  }

  _handleSubmit() {
    const { modalValues, toggleModal } = this.props;

    modalValues.startDate = modalValues.startDate.format('YYYY-MM-DD');
    modalValues.endDate = modalValues.type === 'Temp' ? modalValues.endDate.format('YYYY-MM-DD') : null;

    if (modalValues.action === '_new') {
      fetch('/api/employer/vacancies', {
        method: 'POST',
        credentials: 'same-origin',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(modalValues)
      })
      .then(response => response.json())
      .then(resJSON => console.log("i'm here 0: ", resJSON))
      .catch(console.error)
      .then(toggleModal);
    } else if (modalValues.action === '_edit') {
      fetch(`/api/employer/vacancies/${modalValues.postingId}`, {
        method: 'PUT',
        credentials: 'same-origin',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(modalValues)
      })
      .then(response => response.ok ?
        console.log("i'm here 0: updated vacancy") :
        null
      )
      .catch(console.error)
      .then(toggleModal);
    }

  }

  render() {
    const { modals, toggleModal, modalValues } = this.props;
    return (
      <div className={modals.postingModal ? 'modal is-active' : 'modal'}>
        <div className='modal-background' onClick={toggleModal}></div>
        <div className='modal-card'>
          <header className='modal-card-head'>
            <p className='modal-card-title'>
              { modalValues.action === '_new' ? 'New Posting' : 'Edit Posting' }
            </p>
            <button className='delete' onClick={toggleModal}></button>
          </header>
          { this._renderModalBody() }
          <footer className='modal-card-foot'>
            <button className='button is-warning'>
              <label className='checkbox'>
                <input
                  type='checkbox'
                  name='anonymous'
                  checked={modalValues.anonymous}
                  onChange={this._handleChange} /> Anonymous Posting
              </label>
            </button>
            <button className='button is-primary' disabled={!this._validateForm()} onClick={this._handleSubmit}>Submit</button>
            <button className='button' onClick={toggleModal}>Cancel</button>
          </footer>
        </div>
      </div>
    );
  }
}
