import React from 'react';
import Downshift from 'downshift';
import PropTypes from 'prop-types';
import TetherComponent from 'react-tether';
import TextField from '../TextField';

const defaultProps = {
  validationEnabled: true,
  tether: {
    attachment: 'top center',
    renderElementTo: null,
    targetAttachment: 'bottom center',
    optimizations: {
      gpu: false,
    },
    constraints: [
      {
        to: 'scrollParent',
      },
    ],
  },
};

const propTypes = {
  input: PropTypes.object,
  label: PropTypes.string,
  meta: PropTypes.object,
  required: PropTypes.bool,
  screenReaderMessage: PropTypes.string,
  suggestions: PropTypes.arrayOf(PropTypes.object),
  tether: PropTypes.object,
  validationEnabled: PropTypes.bool,
};

class AutoComplete extends React.Component {
  constructor(props) {
    super(props);
    this.textfield = React.createRef();
  }

  render() {
    const { tether,
      suggestions,
      label,
      required,
      input,
      meta, validationEnabled } = this.props;

    const value = input ? input.value : '';
    const textfieldRef = this.textfield;

    const inputProps = {
      autoComplete: 'off',
      required,
      label,
      validationEnabled,
      value,
      meta,
      input,
      ref: textfieldRef,
    };

    const mergedTetherProps = Object.assign({}, AutoComplete.defaultProps.tether, tether);
    return (
      <TetherComponent {...mergedTetherProps}>
        <Downshift
          style={{ display: 'inline-block', position: 'relative' }}
          itemToString={item => (item ? item.value : '')}
          defaultInputValue={value}
        >
          {({
              getInputProps,
              getItemProps,
              getMenuProps,
              selectedItem,
              highlightedIndex,
              isOpen,
              inputValue,
            }) => (
              <div>
                <div style={{ position: 'relative', width: '100%' }}>
                  <div
                    aria-live="assertive"
                    aria-relevant="additions"
                  >
                    <TextField {...getInputProps(
                        { ...inputProps,
                          onBlur: (e) => {
                              e.preventDefault();
                              input.onBlur(e);
                        } }
                      )}
                    />
                  </div>
                  <ul style={{ listStyleType: 'none' }} {...getMenuProps()}>
                    {isOpen
                      ? suggestions
                        .filter(item => !inputValue || item.value.includes(inputValue))
                        .map((item, index) => (
                          <li
                            {...getItemProps({
                              key: item.value,
                              index,
                              item,
                              style: {
                                backgroundColor:
                                  highlightedIndex === index ? 'lightgray' : 'white',
                                fontWeight: selectedItem === item ? 'bold' : 'normal',
                              },
                            })}
                          >
                            {item.value}
                          </li>
                        ))
                    : null}
                  </ul>
                </div>
              </div>
              )
            }
        </Downshift>
      </TetherComponent>
    );
  }
}

AutoComplete.propTypes = propTypes;
AutoComplete.defaultProps = defaultProps;

export default AutoComplete;