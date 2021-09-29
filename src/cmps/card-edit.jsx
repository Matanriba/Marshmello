import React, { Component } from 'react'
import { connect } from 'react-redux'
import { CardEditSidebar } from './card-edit/card-edit-sidebar'
import { LabelsMembers } from './card-edit/labels-members'
import { ChecklistEdit } from './card-edit/checklist-edit'
import { onUpdateCard, onSetCardId } from '../store/board.actions'
import { IoMdClose } from 'react-icons/io'
import { TiCreditCard } from 'react-icons/ti'
import { CgCreditCard } from 'react-icons/cg'
import { CardEditDescription } from './card-edit/card-edit-description'
import { CardEditActivities } from './card-edit/card-edit-activities'
import { CardEditAttachment } from './card-edit/card-edit-attachment'

class _CardEdit extends Component {
    state = {
        currCard: null,
        currGroup: null
    }

    modalRef = React.createRef()

    componentDidMount() {
        document.addEventListener('mousedown', this.handleClick)
        let currCard
        let currGroup
        const { cardId, groupId } = this.props.match.params
        this.props.onSetCardId(cardId)
        if (this.props.board.groups) {
            currCard = this.getDataById(cardId, groupId).currentCard
            currGroup = this.getDataById(cardId, groupId).currentGroup
        }
        this.setState({ currCard, currGroup })
    }

    componentWillUnmount() {
        document.removeEventListener('mousedown', this.handleClick)
    }

    handleClick = e => {
        if (!this.modalRef?.current?.contains(e.target)) {
            this.props.history.goBack()
        }
    }

    getDataById = (cardId, groupId) => {
        const board = this.props.board
        const currentGroup = board.groups.find(group => group.id === groupId)
        const currentCard = currentGroup.cards.find(card => card.id === cardId)
        return { currentGroup, currentCard }
    }

    handleInputChange = ({ target: { name, value } }) => {
        this.setState({ currCard: { ...this.state.currCard, [name]: value } })
    }

    handlePropertyChange = (card = this.state.currCard) => {
        const { board } = this.props
        const { groupId } = this.props.match.params
        this.props.onUpdateCard(card, groupId, board)
    }

    render() {
        const { currCard, currGroup } = this.state
        if (!currCard) return <div>Loading...</div>
        // console.log(new Date(currCard?.dueDate));
        return (
            <div className="edit-modal-container">
                <section className="card-edit" ref={this.modalRef}>
                    {currCard.style?.bgColor && <div className="card-edit-bg" style={{ backgroundColor: currCard.style.bgColor }}></div>}
                    <button className="close-modal-btn" onClick={() => this.props.history.goBack()}><IoMdClose /></button>
                    {currCard.style?.bgColor && <button className="change-cover-btn">
                        <span className="cover-icon"><TiCreditCard /></span>
                        <span>Cover</span>
                    </button>}

                    <div className="card-edit-header card-title-container">
                        <span><CgCreditCard /></span>
                        <input className="title-input" type="text" value={currCard.title} name="title" onChange={this.handleInputChange} onBlur={() => this.handlePropertyChange()} />
                    </div>

                    <div className="list-name-container"><p>in list <span className="list-name">{currGroup.title}</span></p></div>

                    <div className="flex">
                        <div className="card-edit-main">

                            <LabelsMembers />

                            <CardEditDescription />

                            {currCard.attachments?.length && <CardEditAttachment />}

                            {currCard.checklists?.map(checklist => (
                                <div key={checklist.id}>
                                    <ChecklistEdit checklist={checklist} currCard={currCard} handlePropertyChange={this.handlePropertyChange} />
                                </div>
                            ))}

                            <CardEditActivities />

                        </div>

                        <CardEditSidebar />

                    </div>
                </section>
            </div>
        )
    }
}

const mapStateToProps = state => {
    return {
        board: state.boardModule.currBoard
    }
}

const mapDispatchToProps = {
    onUpdateCard,
    onSetCardId
}

export const CardEdit = connect(mapStateToProps, mapDispatchToProps)(_CardEdit);
