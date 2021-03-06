import React, {Component} from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { empGetApplList } from 'actions/EmployerPage/Applications';
import { empPostingApplViewed } from 'actions/EmployerPage/Postings';
import ApplicantRow from 'components/EmployerPage/ApplicantRow.jsx';

@connect(state => ({
  modals: state.empControlBar.get('modals'),
  modalValues: state.empControlBar.get('modalValues'),
  applications: state.empApplications.get('applications'),
  pageError: state.empApplications.get('pageError'),
  dataLoaded: state.empApplications.get('dataLoaded')
}))

export default class ApplicantListModal extends Component {
  static propTypes = {
    modals: PropTypes.object,
    modalValues: PropTypes.object,
    applications: PropTypes.array,
    pageError: PropTypes.bool,
    dataLoaded: PropTypes.bool,
    toggleModal: PropTypes.func,
    dispatch: PropTypes.func
  }

  constructor() {
    super();
    this._renderCompAfterData = this._renderCompAfterData.bind(this);
    this._toggleModal = this._toggleModal.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    const { modalValues, dispatch } = this.props;
    if (nextProps.modals.applicantListModal && nextProps.modalValues.vacancyId !== modalValues.vacancyId) {
      dispatch(empGetApplList(nextProps.modalValues.vacancyId));
    }
  }

  _renderCompAfterData() {
    const { dataLoaded, pageError, applications, modalValues } = this.props;
    if (dataLoaded && pageError) {
      return (
        <p className='page-msg'>
          <i className='fa fa-exclamation-triangle' aria-hidden='true' />
          Error in loading up the page
        </p>
      );
    } else if (dataLoaded) {
      return (
        <div className='applicants-container'>
          <p className='title position-info'>{modalValues.title} @ {modalValues.officeName}</p>
          { applications.map(appl => <ApplicantRow key={appl.id} appl={appl} /> ) }
          { !applications.length && <p>No more open application.</p> }
        </div>
      );
    } else {
      return (
        <p className='page-msg'>
          <i className='fa fa-spinner fa-spin fa-3x fa-fw'></i>
          <span className='sr-only'>Loading...</span>
        </p>
      );
    }
  }

  _toggleModal() {
    const { toggleModal, modalValues, dispatch } = this.props;
    dispatch(empPostingApplViewed(modalValues.vacancyId));
    toggleModal();
  }

  render() {
    return (
      <div className={this.props.modals.applicantListModal ? 'modal is-active' : 'modal'}>
        <div className='modal-background' onClick={this._toggleModal} />
        <div className='modal-card'>
          <header className='modal-card-head'>
            <p className='modal-card-title'>Applications</p>
            <button className='delete' aria-label='close' title='Close' onClick={this._toggleModal} />
          </header>
          <section className='modal-card-body'>
            { this._renderCompAfterData() }
          </section>
          <footer className='modal-card-foot'>
            <button className='button' onClick={this._toggleModal}>Close</button>
          </footer>
        </div>
      </div>
    );
  }
}
