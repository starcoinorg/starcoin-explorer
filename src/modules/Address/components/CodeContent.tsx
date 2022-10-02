import * as React from 'react';
import Box from '@mui/material/Box';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import TreeView from '@mui/lab/TreeView';
import TreeItem from '@mui/lab/TreeItem';
import { isString } from 'lodash';
import { WasmFs } from '@wasmer/wasmfs';
import { Disassemble } from '@starcoin/move-js';
import { useState } from 'react';

type Props = {
  codes: any
}


function FunctionItem(props: Props) {
  const { codes } = props;
  return <>{codes.map((item: any, index: any) => {

    const prams = item.args.map((arg: any) => {
      let type_tag;
      if (isString(arg.type_tag)) {
        type_tag = arg.type_tag;
      } else {
        type_tag = Object.keys(arg.type_tag).map((key) => {
          return `${key}<${arg.type_tag[key]}>`;
        }).join(', ');
      }
      return `${arg.name}: ${type_tag}`;
    }).join(', ');

    return <TreeItem nodeId={`function${item.name}${index}`} key={item.name + index}
      label={`${item.name}( ${prams} )`} />;
  })}</>;
}


function structField(fields: any) {
  return fields.map((field: any) => {
    let type_abi;
    if (isString(field.type_abi)) {
      type_abi = field.type_abi;
    } else {
      type_abi = structAbi(field.type_abi);
    }
    return `${field.name}: ${type_abi}`;
  }).join(' , ');
}

// @ts-ignore
function structAbi(type_abi: any) {
  return Object.keys(type_abi).map((abi: any) => {

    let inner;
    switch (abi) {
      case 'Struct':
        const innerStruct = structField(type_abi.Struct.fields);
        inner = `${type_abi.Struct.name} { ${innerStruct} } `;
        break;
      case 'Vector':
        if (isString(type_abi.Vector)) {
          inner = `Vector<${type_abi.Vector}>`;
        } else {
          inner = structAbi(type_abi.Vector);
          inner = `Vector<${inner}>`;
        }
        break;
      default:
    }

    return `${inner}`;
  }).join(', \n');
}


function StructItem(props: Props) {
  const { codes } = props;
  return <>{codes.map((item: any, index: any) => {
    const fields = structField(item.fields);
    return <div key={item.name + index}> <TreeItem nodeId={`struct${item.name}${index}`} label={`${item.name} { ${fields} } `} />
      <br /> </div>;
  })}</>;
}


export default function CodeContent(props: Props) {
  const { codes } = props;

  const [expanded, setExpanded] = useState<string[]>([]);
  const [bytecode, setBytecode] = useState<Map<string, string>>(new Map());

  const dis = (nodeIds: string[]) => {
    nodeIds.forEach((v: string) => {
      if (v.includes("&")) {
        const key = v.split("&");
        if (!bytecode?.get(key[0])) {
          const mp = new Disassemble(new WasmFs());
          const item = codes[parseInt(key[1], 10)];
          mp.disassemble(item.name, item.code, (_: boolean, data: string) => {
            setBytecode(new Map(bytecode.set(item.name, data)));
          })
        }
      }
    })
  }

  if (codes.length === 0) {
    return <div> no data </div>
  }

  const handleToggle = (_: React.SyntheticEvent, nodeIds: string[]) => {

    dis(nodeIds);
    setExpanded(nodeIds);

  };

  return (
    <Box sx={{ height: '100%', flexGrow: 1, maxWidth: '100%', overflowY: 'auto' }}>
      <TreeView
        aria-label='controlled'
        defaultCollapseIcon={<ExpandMoreIcon />}
        defaultExpandIcon={<ChevronRightIcon />}
        expanded={expanded}
        onNodeToggle={handleToggle}
        multiSelect
      >

        {codes.map((item: any, index: any) => {
          return <TreeItem nodeId={item.name + index} key={item.name + index} label={item.name}>
            {item.info.script_functions.length > 0 ?
              <TreeItem nodeId={`${item.name}${index}1`} label='script_functions'>
                <FunctionItem codes={item.info.script_functions} />
              </TreeItem>
              : <TreeItem nodeId={`${item.name}${index}1`} label='script_functions' />}

            {item.info.structs.length > 0 ?
              <TreeItem nodeId={`${item.name}${index}2`} label='structs'>
                <StructItem codes={item.info.structs} />
              </TreeItem>
              : <TreeItem nodeId={`${item.name}${index}2`} label='structs' />}

            <TreeItem nodeId={`${item.name}&${index}`} label='bytecode' >
              <pre>
                <p>{bytecode.get(item.name) ? bytecode?.get(item.name) : "loading..."}</p>
              </pre>

            </TreeItem>
          </TreeItem>;

        })}

      </TreeView>
    </Box >
  );
}