import Badge from '@material-ui/core/Badge'
import { alertSuccess } from '@xrengine/client-core/src/common/reducers/alert/service'
import { selectAppOnBoardingStep } from '@xrengine/client-core/src/common/reducers/app/selector'
import { selectAuthState } from '@xrengine/client-core/src/user/reducers/auth/selector'
import {
  fetchAvatarList,
  removeAvatar,
  updateUserAvatarId,
  updateUserSettings,
  uploadAvatarModel
} from '@xrengine/client-core/src/user/reducers/auth/service'
import { EngineEvents } from '@xrengine/engine/src/ecs/classes/EngineEvents'
import { enableInput } from '@xrengine/engine/src/input/systems/ClientInputSystem'
import { EngineRenderer } from '@xrengine/engine/src/renderer/WebGLRendererSystem'
import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators, Dispatch } from 'redux'
import DownArrow from '../assets/DownArrow.png'
import AvatarMenu from './menus/AvatarMenu'
import AvatarSelectMenu from './menus/AvatarSelectMenu'
import ProfileMenu from './menus/ProfileMenu'
import ShareMenu from './menus/ShareMenu'
import InstanceChat from '../MapInstanceChat'
import styles from './MapUserMenu.module.scss'
import { UserMenuProps, Views } from './util'

enum PanelState {
  CLOSE,
  MENU_OPEN,
  PANEL_OPEN
}

enum ActivePanel {
  NONE,
  SHARE,
  CHAT
}

const mapStateToProps = (state: any): any => {
  return {
    onBoardingStep: selectAppOnBoardingStep(state),
    authState: selectAuthState(state)
  }
}

const mapDispatchToProps = (dispatch: Dispatch): any => ({
  updateUserAvatarId: bindActionCreators(updateUserAvatarId, dispatch),
  updateUserSettings: bindActionCreators(updateUserSettings, dispatch),
  alertSuccess: bindActionCreators(alertSuccess, dispatch),
  // provisionInstanceServer: bindActionCreators(provisionInstanceServer, dispatch),
  uploadAvatarModel: bindActionCreators(uploadAvatarModel, dispatch),
  fetchAvatarList: bindActionCreators(fetchAvatarList, dispatch),
  removeAvatar: bindActionCreators(removeAvatar, dispatch)
})

const UserMenu = (props: UserMenuProps): any => {
  const { authState, updateUserAvatarId, alertSuccess, uploadAvatarModel, fetchAvatarList, enableSharing, hideLogin } =
    props

  const menuPanel = {
    [Views.Profile]: ProfileMenu,
    [Views.Share]: ShareMenu,
    [Views.Avatar]: AvatarMenu,
    [Views.AvatarUpload]: AvatarSelectMenu
  }

  const [engineLoaded, setEngineLoaded] = useState(false)
  const [panelState, setPanelState] = useState(PanelState.CLOSE)
  const [activePanel, setActivePanel] = useState(ActivePanel.NONE)
  const [hasUnreadMessages, setUnreadMessages] = useState(false)

  const selfUser = authState.get('user') || {}
  const avatarList = authState.get('avatarList') || []

  const [currentActiveMenu, setCurrentActiveMenu] = useState(enableSharing === false ? (menus[0] as any) : null)
  const [activeLocation, setActiveLocation] = useState(null)

  const [userSetting, setUserSetting] = useState(selfUser?.user_setting)
  const [graphics, setGraphicsSetting] = useState({})

  useEffect(() => {
    EngineEvents.instance?.addEventListener(EngineRenderer.EVENTS.QUALITY_CHANGED, updateGraphicsSettings)

    return () => {
      EngineEvents.instance?.removeEventListener(EngineRenderer.EVENTS.QUALITY_CHANGED, updateGraphicsSettings)
    }
  }, [])
  const onEngineLoaded = () => {
    setEngineLoaded(true)
    document.removeEventListener('ENGINE_LOADED', onEngineLoaded)
  }
  document.addEventListener('ENGINE_LOADED', onEngineLoaded)

  const setAvatar = (avatarId: string, avatarURL: string, thumbnailURL: string) => {
    if (selfUser) {
      updateUserAvatarId(selfUser.id, avatarId, avatarURL, thumbnailURL)
    }
  }

  const setUserSettings = (newSetting: any): void => {
    const setting = { ...userSetting, ...newSetting }
    setUserSetting(setting)
    updateUserSettings(selfUser.user_setting.id, setting)
  }

  const updateGraphicsSettings = (newSetting: any): void => {
    const setting = { ...graphics, ...newSetting }
    setGraphicsSetting(setting)
  }

  const setActiveMenu = (e): void => {
    const enabled = true
    console.log('setActiveMenu called')
    // const enabled = Boolean(currentActiveMenu && currentActiveMenu.id === identity[0])
    // setCurrentActiveMenu(enabled ? null : menus[identity[1]])
    if (EngineEvents.instance)
      enableInput({
        keyboard: enabled,
        mouse: enabled
      })
  }

  const changeActiveMenu = (menu) => {
    if (currentActiveMenu !== null) {
      const enabled = Boolean(menu)
      if (EngineEvents.instance)
        enableInput({
          keyboard: !enabled,
          mouse: !enabled
        })
    }
    setCurrentActiveMenu(menu ? { id: menu } : null)
  }

  const changeActiveLocation = (location) => {
    setActiveLocation(location)
    setCurrentActiveMenu({ id: Views.NewLocation })
  }

  const updateLocationDetail = (location) => {
    setActiveLocation({ ...location })
  }

  const renderMenuPanel = () => {
    if (!currentActiveMenu) return null

    let args = {}
    switch (currentActiveMenu.id) {
      case Views.Profile:
        args = {
          changeActiveMenu: changeActiveMenu,
          hideLogin
        }
        break
      case Views.Avatar:
        args = {
          setAvatar: setAvatar,
          changeActiveMenu: changeActiveMenu,
          removeAvatar: removeAvatar,
          fetchAvatarList: fetchAvatarList,
          avatarList: avatarList,
          avatarId: selfUser?.avatarId,
          enableSharing: enableSharing
        }
        break
      case Views.Settings:
        args = {
          setting: userSetting,
          setUserSettings: setUserSettings,
          graphics: graphics,
          setGraphicsSettings: updateGraphicsSettings
        }
        break
      case Views.Share:
        args = { alertSuccess: alertSuccess }
        break
      case Views.AvatarUpload:
        args = {
          userId: selfUser?.id,
          changeActiveMenu: changeActiveMenu,
          uploadAvatarModel: uploadAvatarModel
        }
        break
      case Views.Location:
        args = {
          changeActiveLocation
        }
        break
      case Views.NewLocation:
        args = {
          location: activeLocation,
          changeActiveMenu,
          updateLocationDetail
        }
        break
      default:
        return null
    }

    const Panel = menuPanel[currentActiveMenu.id]
    // @ts-ignore
    return <Panel {...args} />
  }

  const changeActivePanel = (panel: ActivePanel) => {
    setActivePanel(panel)
    setPanelState(panel === ActivePanel.NONE ? PanelState.CLOSE : PanelState.PANEL_OPEN)
  }

  const togglePanelStatus = () => {
    if (panelState === PanelState.MENU_OPEN || panelState === PanelState.PANEL_OPEN) {
      setPanelState(PanelState.CLOSE)
      setActivePanel(ActivePanel.NONE)
    } else {
      setPanelState(PanelState.MENU_OPEN)
    }
  }

  return (
    <>
      <section className={styles.settingContainer}>
        <div className={styles.iconContainer}>
          <span
            id={Views.Profile}
            // onClick={ShowProfile}
            // className={'profile'}
            className={styles.profile}
          >
            <img src={DownArrow} />
          </span>
        </div>
        {currentActiveMenu ? renderMenuPanel() : null}
      </section>
      <section className={styles.circleMenu}>
        {panelState === PanelState.MENU_OPEN ? (
          <div className={styles.menu}>
            <div className={styles.menuBackground}>
              <img src="/static/Oval.png" />
            </div>
            <Badge
              color="primary"
              variant="dot"
              invisible={!hasUnreadMessages}
              anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
              className={styles.chatBadge}
            >
              <button className={styles.iconCallChat} onClick={() => changeActivePanel(ActivePanel.CHAT)}>
                <img src="/static/Chat.png" />
              </button>
            </Badge>
            <button className={styles.share} onClick={() => changeActivePanel(ActivePanel.SHARE)}>
              <img src="/static/Share.png" />
            </button>
          </div>
        ) : panelState === PanelState.PANEL_OPEN ? (
          <InstanceChat isOpen={activePanel === ActivePanel.CHAT} setUnreadMessages={setUnreadMessages} />
        ) : null}

        <button className={styles.menuBtn} onClick={togglePanelStatus}>
          {panelState === PanelState.CLOSE ? (
            <img src="/static/Plus.png" />
          ) : (
            <img src="/static/Plus.png" className={styles.open} />
          )}
        </button>
      </section>
    </>
  )
}

export default connect(mapStateToProps, mapDispatchToProps)(UserMenu)