import React, { FunctionComponent, memo } from 'react'
import SidebarGroupTitle from './sidebar-group-title';
import SidebarGroupItem from './sidebar-group-item';
import { removeHashIfNeeded } from '../../lib/util';
import { SidebarStructure } from '../sidebar';

type Props = {
  sidebar: SidebarStructure
  file: string
  hash: string
}

const SidebarContent: FunctionComponent<Props> = ({ sidebar, file, hash }) => {
  const isActive = (id: string) => removeHashIfNeeded(id) === removeHashIfNeeded(hash)

  return (
    <>
      {Object.keys(sidebar).map((header, index) => {
        return (
          <SidebarGroupTitle key={`${file}-title-${index}`} title={header} id={`#${header}`} active={isActive(header)}>
            {sidebar[header].map((item) =>
              <SidebarGroupItem key={`${file}-item-${removeHashIfNeeded(item.id)}`} id={item.id} title={item.title} active={isActive(item.id)} />
            )}
          </SidebarGroupTitle>
        )
      })}
    </>
  )
}

export default memo(SidebarContent)
