import * as React from "react";
import { WithContext as ReactTags, Tag } from "react-tag-input";
import * as css from "./TagsSelector.scss";

interface IProps {
  onChange: (tags: Array<Tag>) => void;
}

interface IState {
  tags: Array<Tag>;
}

const KeyCodes = {
  comma: 188,
  enter: 13,
  tab: 9,
};
 
const delimiters = [KeyCodes.comma, KeyCodes.enter, KeyCodes.tab];
  
export default class TagsSelector extends React.Component<IProps, IState> {

  constructor(props: IProps) {
    super(props);

    this.state = { tags: new Array<Tag>() };
  }

  private handleDelete = () => (i: number): void => {
    const tags = this.state.tags;
    this.setState({
      tags: tags.filter((_tag: Tag, index: number) => index !== i),
    });
        
    if (this.props.onChange) {
      this.props.onChange(this.state.tags);
    }
  }
 
  private handleAddition = () => (tag: Tag): void => {
    this.setState({ tags: [...this.state.tags, tag] });

    if (this.props.onChange) {
      this.props.onChange(this.state.tags);
    }
  }

  private handleDrag = () => (tag: Tag, currPos: number, newPos: number): void => {
    const tags = this.state.tags.slice();

    tags.splice(currPos, 1);
    tags.splice(newPos, 0, tag);

    this.setState({ tags });

    if (this.props.onChange) {
      this.props.onChange(tags);
    }
  }

  public render(): RenderOutput {
    const { tags } = this.state;
    const suggestions = [
      {id: "fun", text: "fun"},
      {id: "delete", text: "delete"},
      {id: "deleterious", text: "Deleterious"},
      {id: "deletion", text: "deletion"},
      {id: "indelable", text: "Indelable"},
      {id: "indelicate", text: "indelicate"},
      {id: "indisrete", text: "Indisrete"},
      {id: "governance", text: "governance"},
      {id: "extra", text: "extra terrestrial"}] as Array<Tag>;

    return <div className={css.reactTagsContainer}>
      <ReactTags
        tags={tags}
        suggestions={suggestions}
        handleDelete={this.handleDelete()}
        handleAddition={this.handleAddition()}
        handleDrag={this.handleDrag()}
        delimiters={delimiters}
        inputFieldPosition="inline"
        autocomplete={1}
      />
    </div>;
  }
}
