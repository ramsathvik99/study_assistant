export type LanguageCode = "en" | "es" | "fr" | "de" | "zh" | "ja";

export interface Translations {
  // Navigation
  nav: {
    home: string;
    session: string;
    dashboard: string;
    history: string;
    settings: string;
  };
  
  // Settings
  settings: {
    title: string;
    subtitle: string;
    appearance: string;
    aiSettings: string;
    document: string;
    notifications: string;
    privacy: string;
    account: string;
    accessibility: string;
    keyboard: string;
    language: string;
    developer: string;
    about: string;
  };

  // Appearance
  appearance: {
    darkMode: string;
    highContrast: string;
    animations: string;
    reducedMotion: string;
    fontSize: string;
    accentColor: string;
    reset: string;
  };

  // AI Settings
  ai: {
    model: string;
    responseLength: string;
    creativity: string;
    streaming: string;
    difficulty: string;
    autoGenerateQuiz: string;
    includeMnemonics: string;
    outputSections: string;
    reset: string;
  };

  // Document
  document: {
    maxChunkSize: string;
    autoSummarization: string;
    ocrEnabled: string;
    rememberLastFolder: string;
    reset: string;
  };

  // Notifications
  notifications: {
    enable: string;
    studyReminders: string;
    completionNotifications: string;
    achievementAlerts: string;
    reset: string;
  };

  // Privacy
  privacy: {
    saveHistory: string;
    analytics: string;
    clearHistory: string;
    exportData: string;
    importData: string;
    clearAllData: string;
    reset: string;
  };

  // Account
  account: {
    displayName: string;
    reset: string;
  };

  // Accessibility
  accessibility: {
    largeText: string;
    keyboardNavigation: string;
    screenReaderEnhancements: string;
    reset: string;
  };

  // Keyboard
  keyboard: {
    shortcuts: string;
    enabled: string;
  };

  // Common
  common: {
    save: string;
    export: string;
    import: string;
    reset: string;
    resetAll: string;
    confirm: string;
    cancel: string;
    delete: string;
    success: string;
    error: string;
  };

  // Messages
  messages: {
    settingsSaved: string;
    settingsReset: string;
    historyCleared: string;
    dataClearedWarning: string;
    settingsExported: string;
    settingsImported: string;
    failedToImport: string;
  };
}

export const translations: Record<LanguageCode, Translations> = {
  en: {
    nav: {
      home: "Home",
      session: "Session",
      dashboard: "Dashboard",
      history: "History",
      settings: "Settings",
    },
    settings: {
      title: "Settings",
      subtitle: "Customize your study experience",
      appearance: "Appearance",
      aiSettings: "AI Settings",
      document: "Document",
      notifications: "Notifications",
      privacy: "Privacy",
      account: "Account",
      accessibility: "Accessibility",
      keyboard: "Keyboard",
      language: "Language",
      developer: "Developer",
      about: "About",
    },
    appearance: {
      darkMode: "Dark Mode",
      highContrast: "High Contrast",
      animations: "Animations",
      reducedMotion: "Reduce Motion",
      fontSize: "Font Size",
      accentColor: "Accent Color",
      reset: "Reset Appearance",
    },
    ai: {
      model: "AI Model",
      responseLength: "Response Length",
      creativity: "Creativity",
      streaming: "Streaming",
      difficulty: "Difficulty",
      autoGenerateQuiz: "Auto-Generate Quiz",
      includeMnemonics: "Include Mnemonics",
      outputSections: "Output Sections",
      reset: "Reset AI Settings",
    },
    document: {
      maxChunkSize: "Max Chunk Size",
      autoSummarization: "Auto Summarization",
      ocrEnabled: "OCR Enabled",
      rememberLastFolder: "Remember Last Folder",
      reset: "Reset Document Settings",
    },
    notifications: {
      enable: "Enable Notifications",
      studyReminders: "Study Reminders",
      completionNotifications: "Completion Notifications",
      achievementAlerts: "Achievement Alerts",
      reset: "Reset Notifications",
    },
    privacy: {
      saveHistory: "Save Study History",
      analytics: "Analytics",
      clearHistory: "Clear Study History",
      exportData: "Export Data",
      importData: "Import Data",
      clearAllData: "Clear All Data",
      reset: "Reset Privacy",
    },
    account: {
      displayName: "Display Name",
      reset: "Reset Account Settings",
    },
    accessibility: {
      largeText: "Large Text",
      keyboardNavigation: "Keyboard Navigation",
      screenReaderEnhancements: "Screen Reader Enhancements",
      reset: "Reset Accessibility",
    },
    keyboard: {
      shortcuts: "Keyboard Shortcuts",
      enabled: "Enable Keyboard Shortcuts",
    },
    common: {
      save: "Save",
      export: "Export",
      import: "Import",
      reset: "Reset",
      resetAll: "Reset All",
      confirm: "Confirm",
      cancel: "Cancel",
      delete: "Delete",
      success: "Success",
      error: "Error",
    },
    messages: {
      settingsSaved: "Settings saved successfully!",
      settingsReset: "Settings reset to defaults!",
      historyCleared: "History cleared!",
      dataClearedWarning: "All data cleared!",
      settingsExported: "Settings exported!",
      settingsImported: "Settings imported successfully!",
      failedToImport: "Failed to import settings",
    },
  },

  es: {
    nav: {
      home: "Inicio",
      session: "Sesión",
      dashboard: "Panel",
      history: "Historial",
      settings: "Configuración",
    },
    settings: {
      title: "Configuración",
      subtitle: "Personaliza tu experiencia de estudio",
      appearance: "Apariencia",
      aiSettings: "Configuración de IA",
      document: "Documento",
      notifications: "Notificaciones",
      privacy: "Privacidad",
      account: "Cuenta",
      accessibility: "Accesibilidad",
      keyboard: "Teclado",
      language: "Idioma",
      developer: "Desarrollador",
      about: "Acerca de",
    },
    appearance: {
      darkMode: "Modo Oscuro",
      highContrast: "Alto Contraste",
      animations: "Animaciones",
      reducedMotion: "Reducir Movimiento",
      fontSize: "Tamaño de Fuente",
      accentColor: "Color de Énfasis",
      reset: "Restablecer Apariencia",
    },
    ai: {
      model: "Modelo de IA",
      responseLength: "Longitud de Respuesta",
      creativity: "Creatividad",
      streaming: "Transmisión",
      difficulty: "Dificultad",
      autoGenerateQuiz: "Generar Cuestionario Automáticamente",
      includeMnemonics: "Incluir Mnemónicos",
      outputSections: "Secciones de Salida",
      reset: "Restablecer Configuración de IA",
    },
    document: {
      maxChunkSize: "Tamaño Máximo de Fragmento",
      autoSummarization: "Resumen Automático",
      ocrEnabled: "OCR Habilitado",
      rememberLastFolder: "Recordar Última Carpeta",
      reset: "Restablecer Configuración de Documento",
    },
    notifications: {
      enable: "Habilitar Notificaciones",
      studyReminders: "Recordatorios de Estudio",
      completionNotifications: "Notificaciones de Finalización",
      achievementAlerts: "Alertas de Logros",
      reset: "Restablecer Notificaciones",
    },
    privacy: {
      saveHistory: "Guardar Historial de Estudio",
      analytics: "Analítica",
      clearHistory: "Borrar Historial de Estudio",
      exportData: "Exportar Datos",
      importData: "Importar Datos",
      clearAllData: "Borrar Todos los Datos",
      reset: "Restablecer Privacidad",
    },
    account: {
      displayName: "Nombre para Mostrar",
      reset: "Restablecer Configuración de Cuenta",
    },
    accessibility: {
      largeText: "Texto Grande",
      keyboardNavigation: "Navegación por Teclado",
      screenReaderEnhancements: "Mejoras de Lector de Pantalla",
      reset: "Restablecer Accesibilidad",
    },
    keyboard: {
      shortcuts: "Atajos de Teclado",
      enabled: "Habilitar Atajos de Teclado",
    },
    common: {
      save: "Guardar",
      export: "Exportar",
      import: "Importar",
      reset: "Restablecer",
      resetAll: "Restablecer Todo",
      confirm: "Confirmar",
      cancel: "Cancelar",
      delete: "Eliminar",
      success: "Éxito",
      error: "Error",
    },
    messages: {
      settingsSaved: "¡Configuración guardada exitosamente!",
      settingsReset: "¡Configuración restablecida a valores predeterminados!",
      historyCleared: "¡Historial borrado!",
      dataClearedWarning: "¡Todos los datos borrados!",
      settingsExported: "¡Configuración exportada!",
      settingsImported: "¡Configuración importada exitosamente!",
      failedToImport: "Error al importar configuración",
    },
  },

  fr: {
    nav: {
      home: "Accueil",
      session: "Séance",
      dashboard: "Tableau de Bord",
      history: "Historique",
      settings: "Paramètres",
    },
    settings: {
      title: "Paramètres",
      subtitle: "Personnalisez votre expérience d'étude",
      appearance: "Apparence",
      aiSettings: "Paramètres IA",
      document: "Document",
      notifications: "Notifications",
      privacy: "Confidentialité",
      account: "Compte",
      accessibility: "Accessibilité",
      keyboard: "Clavier",
      language: "Langue",
      developer: "Développeur",
      about: "À propos",
    },
    appearance: {
      darkMode: "Mode Sombre",
      highContrast: "Contraste Élevé",
      animations: "Animations",
      reducedMotion: "Réduire les Mouvements",
      fontSize: "Taille de Police",
      accentColor: "Couleur d'Accent",
      reset: "Réinitialiser l'Apparence",
    },
    ai: {
      model: "Modèle IA",
      responseLength: "Longueur de Réponse",
      creativity: "Créativité",
      streaming: "Diffusion en Direct",
      difficulty: "Difficulté",
      autoGenerateQuiz: "Générer le Quiz Automatiquement",
      includeMnemonics: "Inclure les Mnémoniques",
      outputSections: "Sections de Sortie",
      reset: "Réinitialiser les Paramètres IA",
    },
    document: {
      maxChunkSize: "Taille Maximale du Segment",
      autoSummarization: "Résumé Automatique",
      ocrEnabled: "OCR Activé",
      rememberLastFolder: "Mémoriser le Dernier Dossier",
      reset: "Réinitialiser les Paramètres du Document",
    },
    notifications: {
      enable: "Activer les Notifications",
      studyReminders: "Rappels d'Étude",
      completionNotifications: "Notifications d'Achèvement",
      achievementAlerts: "Alertes de Réussite",
      reset: "Réinitialiser les Notifications",
    },
    privacy: {
      saveHistory: "Enregistrer l'Historique d'Étude",
      analytics: "Analyse",
      clearHistory: "Effacer l'Historique d'Étude",
      exportData: "Exporter les Données",
      importData: "Importer les Données",
      clearAllData: "Effacer Toutes les Données",
      reset: "Réinitialiser la Confidentialité",
    },
    account: {
      displayName: "Nom d'Affichage",
      reset: "Réinitialiser les Paramètres du Compte",
    },
    accessibility: {
      largeText: "Texte Grand",
      keyboardNavigation: "Navigation au Clavier",
      screenReaderEnhancements: "Améliorations du Lecteur d'Écran",
      reset: "Réinitialiser l'Accessibilité",
    },
    keyboard: {
      shortcuts: "Raccourcis Clavier",
      enabled: "Activer les Raccourcis Clavier",
    },
    common: {
      save: "Enregistrer",
      export: "Exporter",
      import: "Importer",
      reset: "Réinitialiser",
      resetAll: "Tout Réinitialiser",
      confirm: "Confirmer",
      cancel: "Annuler",
      delete: "Supprimer",
      success: "Succès",
      error: "Erreur",
    },
    messages: {
      settingsSaved: "Paramètres enregistrés avec succès!",
      settingsReset: "Paramètres réinitialisés aux valeurs par défaut!",
      historyCleared: "Historique effacé!",
      dataClearedWarning: "Toutes les données ont été effacées!",
      settingsExported: "Paramètres exportés!",
      settingsImported: "Paramètres importés avec succès!",
      failedToImport: "Échec de l'importation des paramètres",
    },
  },

  de: {
    nav: {
      home: "Startseite",
      session: "Sitzung",
      dashboard: "Dashboard",
      history: "Verlauf",
      settings: "Einstellungen",
    },
    settings: {
      title: "Einstellungen",
      subtitle: "Passen Sie Ihre Lernerfahrung an",
      appearance: "Erscheinungsbild",
      aiSettings: "KI-Einstellungen",
      document: "Dokument",
      notifications: "Benachrichtigungen",
      privacy: "Datenschutz",
      account: "Konto",
      accessibility: "Barrierefreiheit",
      keyboard: "Tastatur",
      language: "Sprache",
      developer: "Entwickler",
      about: "Über",
    },
    appearance: {
      darkMode: "Dunkler Modus",
      highContrast: "Hoher Kontrast",
      animations: "Animationen",
      reducedMotion: "Bewegung Reduzieren",
      fontSize: "Schriftgröße",
      accentColor: "Akzentfarbe",
      reset: "Erscheinungsbild Zurücksetzen",
    },
    ai: {
      model: "KI-Modell",
      responseLength: "Antwortkürze",
      creativity: "Kreativität",
      streaming: "Streaming",
      difficulty: "Schwierigkeit",
      autoGenerateQuiz: "Quiz Automatisch Generieren",
      includeMnemonics: "Mnemoniken Einschließen",
      outputSections: "Ausgabebereiche",
      reset: "KI-Einstellungen Zurücksetzen",
    },
    document: {
      maxChunkSize: "Maximale Chunkgröße",
      autoSummarization: "Automatische Zusammenfassung",
      ocrEnabled: "OCR Aktiviert",
      rememberLastFolder: "Letzten Ordner Merken",
      reset: "Dokumenteinstellungen Zurücksetzen",
    },
    notifications: {
      enable: "Benachrichtigungen Aktivieren",
      studyReminders: "Lernzusammenfassungen",
      completionNotifications: "Abschlussbenachrichtigungen",
      achievementAlerts: "Erfolgsbenachrichtigungen",
      reset: "Benachrichtigungen Zurücksetzen",
    },
    privacy: {
      saveHistory: "Lernverlauf Speichern",
      analytics: "Analytik",
      clearHistory: "Lernverlauf Löschen",
      exportData: "Daten Exportieren",
      importData: "Daten Importieren",
      clearAllData: "Alle Daten Löschen",
      reset: "Datenschutz Zurücksetzen",
    },
    account: {
      displayName: "Anzeigename",
      reset: "Kontoeinstellungen Zurücksetzen",
    },
    accessibility: {
      largeText: "Großer Text",
      keyboardNavigation: "Tastaturnavigation",
      screenReaderEnhancements: "Screenreader-Verbesserungen",
      reset: "Barrierefreiheit Zurücksetzen",
    },
    keyboard: {
      shortcuts: "Tastenkombinationen",
      enabled: "Tastenkombinationen Aktivieren",
    },
    common: {
      save: "Speichern",
      export: "Exportieren",
      import: "Importieren",
      reset: "Zurücksetzen",
      resetAll: "Alles Zurücksetzen",
      confirm: "Bestätigen",
      cancel: "Abbrechen",
      delete: "Löschen",
      success: "Erfolg",
      error: "Fehler",
    },
    messages: {
      settingsSaved: "Einstellungen erfolgreich gespeichert!",
      settingsReset: "Einstellungen auf Standardwerte zurückgesetzt!",
      historyCleared: "Verlauf gelöscht!",
      dataClearedWarning: "Alle Daten gelöscht!",
      settingsExported: "Einstellungen exportiert!",
      settingsImported: "Einstellungen erfolgreich importiert!",
      failedToImport: "Fehler beim Importieren der Einstellungen",
    },
  },

  zh: {
    nav: {
      home: "首页",
      session: "学习",
      dashboard: "仪表板",
      history: "历史记录",
      settings: "设置",
    },
    settings: {
      title: "设置",
      subtitle: "自定义您的学习体验",
      appearance: "外观",
      aiSettings: "AI 设置",
      document: "文档",
      notifications: "通知",
      privacy: "隐私",
      account: "账户",
      accessibility: "无障碍",
      keyboard: "键盘",
      language: "语言",
      developer: "开发者",
      about: "关于",
    },
    appearance: {
      darkMode: "深色模式",
      highContrast: "高对比度",
      animations: "动画",
      reducedMotion: "减少动作",
      fontSize: "字体大小",
      accentColor: "强调色",
      reset: "重置外观",
    },
    ai: {
      model: "AI 模型",
      responseLength: "响应长度",
      creativity: "创意",
      streaming: "流传输",
      difficulty: "难度",
      autoGenerateQuiz: "自动生成测验",
      includeMnemonics: "包括记忆法",
      outputSections: "输出部分",
      reset: "重置 AI 设置",
    },
    document: {
      maxChunkSize: "最大块大小",
      autoSummarization: "自动摘要",
      ocrEnabled: "OCR 已启用",
      rememberLastFolder: "记住上次文件夹",
      reset: "重置文档设置",
    },
    notifications: {
      enable: "启用通知",
      studyReminders: "学习提醒",
      completionNotifications: "完成通知",
      achievementAlerts: "成就提醒",
      reset: "重置通知",
    },
    privacy: {
      saveHistory: "保存学习历史",
      analytics: "分析",
      clearHistory: "清除学习历史",
      exportData: "导出数据",
      importData: "导入数据",
      clearAllData: "清除所有数据",
      reset: "重置隐私",
    },
    account: {
      displayName: "显示名称",
      reset: "重置账户设置",
    },
    accessibility: {
      largeText: "大文本",
      keyboardNavigation: "键盘导航",
      screenReaderEnhancements: "屏幕阅读器增强",
      reset: "重置无障碍",
    },
    keyboard: {
      shortcuts: "键盘快捷键",
      enabled: "启用键盘快捷键",
    },
    common: {
      save: "保存",
      export: "导出",
      import: "导入",
      reset: "重置",
      resetAll: "全部重置",
      confirm: "确认",
      cancel: "取消",
      delete: "删除",
      success: "成功",
      error: "错误",
    },
    messages: {
      settingsSaved: "设置已成功保存!",
      settingsReset: "设置已重置为默认值!",
      historyCleared: "历史记录已清除!",
      dataClearedWarning: "所有数据已清除!",
      settingsExported: "设置已导出!",
      settingsImported: "设置已成功导入!",
      failedToImport: "导入设置失败",
    },
  },

  ja: {
    nav: {
      home: "ホーム",
      session: "セッション",
      dashboard: "ダッシュボード",
      history: "履歴",
      settings: "設定",
    },
    settings: {
      title: "設定",
      subtitle: "学習体験をカスタマイズ",
      appearance: "外観",
      aiSettings: "AI設定",
      document: "ドキュメント",
      notifications: "通知",
      privacy: "プライバシー",
      account: "アカウント",
      accessibility: "アクセシビリティ",
      keyboard: "キーボード",
      language: "言語",
      developer: "開発者",
      about: "について",
    },
    appearance: {
      darkMode: "ダークモード",
      highContrast: "高コントラスト",
      animations: "アニメーション",
      reducedMotion: "モーション削減",
      fontSize: "フォントサイズ",
      accentColor: "アクセントカラー",
      reset: "外観をリセット",
    },
    ai: {
      model: "AIモデル",
      responseLength: "応答長",
      creativity: "創造性",
      streaming: "ストリーミング",
      difficulty: "難易度",
      autoGenerateQuiz: "クイズを自動生成",
      includeMnemonics: "ニーモニックを含める",
      outputSections: "出力セクション",
      reset: "AI設定をリセット",
    },
    document: {
      maxChunkSize: "最大チャンクサイズ",
      autoSummarization: "自動要約",
      ocrEnabled: "OCR有効",
      rememberLastFolder: "最後のフォルダを記憶",
      reset: "ドキュメント設定をリセット",
    },
    notifications: {
      enable: "通知を有効化",
      studyReminders: "学習リマインダー",
      completionNotifications: "完了通知",
      achievementAlerts: "成果アラート",
      reset: "通知をリセット",
    },
    privacy: {
      saveHistory: "学習履歴を保存",
      analytics: "分析",
      clearHistory: "学習履歴をクリア",
      exportData: "データをエクスポート",
      importData: "データをインポート",
      clearAllData: "すべてのデータをクリア",
      reset: "プライバシーをリセット",
    },
    account: {
      displayName: "表示名",
      reset: "アカウント設定をリセット",
    },
    accessibility: {
      largeText: "大きいテキスト",
      keyboardNavigation: "キーボードナビゲーション",
      screenReaderEnhancements: "スクリーンリーダー強化",
      reset: "アクセシビリティをリセット",
    },
    keyboard: {
      shortcuts: "キーボードショートカット",
      enabled: "キーボードショートカットを有効化",
    },
    common: {
      save: "保存",
      export: "エクスポート",
      import: "インポート",
      reset: "リセット",
      resetAll: "すべてリセット",
      confirm: "確認",
      cancel: "キャンセル",
      delete: "削除",
      success: "成功",
      error: "エラー",
    },
    messages: {
      settingsSaved: "設定が正常に保存されました！",
      settingsReset: "設定がデフォルト値にリセットされました！",
      historyCleared: "履歴がクリアされました！",
      dataClearedWarning: "すべてのデータがクリアされました！",
      settingsExported: "設定がエクスポートされました！",
      settingsImported: "設定が正常にインポートされました！",
      failedToImport: "設定のインポートに失敗しました",
    },
  },
};

export function getTranslations(language: LanguageCode): Translations {
  return translations[language] || translations.en;
}
