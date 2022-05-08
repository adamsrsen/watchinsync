import {Component} from 'react'
import styles from './Paginator.module.scss'
import Link from 'next/link'

interface Props {
  page: number
  totalPages: number
  baseUrl: string
}

export default class Paginator extends Component<Props> {

  render() {
    const pages = []
    let page = this.props.page
    pages.push(
      <Link href={`${this.props.baseUrl}/1`}>
        <a className={this.props.page === 1 ? styles.active : ''}>1</a>
      </Link>
    )
    if(this.props.page <= 3) {
      page = 4
    }
    if(this.props.page >= this.props.totalPages - 3){
      page = Math.max(this.props.totalPages - 3, 4)
    }
    for(let i = page - 2; i <= page + 2 && i < this.props.totalPages; i++) {
      if((i > 2 && i === page - 2) || (i < this.props.totalPages - 1 && i == page + 2)) {
        pages.push(<span>...</span>)
      }
      else {
        pages.push(
          <Link href={`${this.props.baseUrl}/${i}`}>
            <a className={this.props.page === i ? styles.active : ''}>{i}</a>
          </Link>
        )
      }
    }
    pages.push(
      <Link href={`${this.props.baseUrl}/${this.props.totalPages}`}>
        <a className={this.props.page === this.props.totalPages ? styles.active : ''}>{this.props.totalPages}</a>
      </Link>
    )

    return (
      <>
        {this.props.totalPages > 1 && (
          <div className={styles.paginator}>
            <Link href={`${this.props.baseUrl}/${this.props.page - 1}`}><a style={{visibility: this.props.page == 1 ? 'hidden' : 'visible'}}>Prev</a></Link>
            {pages.map((page, index) => <div key={index}>{page}</div>)}
            <Link href={`${this.props.baseUrl}/${this.props.page + 1}`}><a style={{visibility: this.props.page == this.props.totalPages ? 'hidden' : 'visible'}}>Next</a></Link>
          </div>
        )}
      </>
    )
  }
}