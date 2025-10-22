import React, { useState } from 'react';
import { 
  Save, 
  RefreshCw, 
  Image, 
  Type, 
  Palette, 
  Eye, 
  EyeOff,
  Upload,
  BookOpen,
  Star,
  TrendingUp,
  Users,
  Award,
  Zap
} from 'lucide-react';
import { useSiteConfig } from '../hooks/useSiteConfig';

export function AdminSiteConfig() {
  const { siteConfig, updateLogo, updateHero, updateTheme, resetToDefault } = useSiteConfig();
  const [activeTab, setActiveTab] = useState<'logo' | 'hero' | 'theme'>('logo');
  const [previewMode, setPreviewMode] = useState(false);

  const iconOptions = [
    { name: 'BookOpen', icon: BookOpen },
    { name: 'Star', icon: Star },
    { name: 'TrendingUp', icon: TrendingUp },
    { name: 'Users', icon: Users },
    { name: 'Award', icon: Award },
    { name: 'Zap', icon: Zap },
  ];

  const handleLogoChange = (field: string, value: string | boolean) => {
    updateLogo({ [field]: value });
  };

  const handleHeroChange = (field: string, value: any) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      updateHero({
        [parent]: {
          ...siteConfig.hero[parent as keyof typeof siteConfig.hero],
          [child]: value
        }
      });
    } else {
      updateHero({ [field]: value });
    }
  };

  const handleThemeChange = (field: string, value: string) => {
    updateTheme({ [field]: value });
  };

  const tabs = [
    { id: 'logo', label: 'Logo & Marque', icon: Type },
    { id: 'hero', label: 'Page d\'accueil', icon: Image },
    { id: 'theme', label: 'Thème & Couleurs', icon: Palette },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
          Configuration du Site
        </h2>
        <div className="flex space-x-2">
          <button
            onClick={() => setPreviewMode(!previewMode)}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              previewMode
                ? 'bg-blue-500 text-white hover:bg-blue-600'
                : 'bg-slate-200 text-slate-700 hover:bg-slate-300 dark:bg-slate-700 dark:text-slate-300'
            }`}
          >
            {previewMode ? <EyeOff className="h-4 w-4 mr-2" /> : <Eye className="h-4 w-4 mr-2" />}
            {previewMode ? 'Masquer aperçu' : 'Aperçu'}
          </button>
          <button
            onClick={resetToDefault}
            className="px-4 py-2 bg-slate-500 text-white rounded-lg hover:bg-slate-600 transition-colors flex items-center"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Réinitialiser
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-slate-200 dark:border-slate-700">
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center ${
                  activeTab === tab.id
                    ? 'border-orange-500 text-orange-600 dark:text-orange-400'
                    : 'border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300'
                }`}
              >
                <Icon className="h-4 w-4 mr-2" />
                {tab.label}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Logo Tab */}
      {activeTab === 'logo' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
              Configuration du Logo
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Texte du logo
                </label>
                <input
                  type="text"
                  value={siteConfig.logo.text}
                  onChange={(e) => handleLogoChange('text', e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-orange-500 dark:bg-slate-700 dark:text-white"
                  placeholder="Nom de votre site"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Sous-titre
                </label>
                <input
                  type="text"
                  value={siteConfig.logo.subtitle}
                  onChange={(e) => handleLogoChange('subtitle', e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-orange-500 dark:bg-slate-700 dark:text-white"
                  placeholder="Slogan ou description courte"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Icône
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {iconOptions.map((option) => {
                    const Icon = option.icon;
                    return (
                      <button
                        key={option.name}
                        onClick={() => handleLogoChange('icon', option.name)}
                        className={`p-3 rounded-lg border-2 flex items-center justify-center transition-colors ${
                          siteConfig.logo.icon === option.name
                            ? 'border-orange-500 bg-orange-50 dark:bg-orange-900/20'
                            : 'border-slate-300 dark:border-slate-600 hover:border-orange-300'
                        }`}
                      >
                        <Icon className="h-6 w-6" />
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="flex space-x-4">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={siteConfig.logo.showIcon}
                    onChange={(e) => handleLogoChange('showIcon', e.target.checked)}
                    className="rounded border-slate-300 text-orange-600 focus:ring-orange-500"
                  />
                  <span className="ml-2 text-sm text-slate-700 dark:text-slate-300">
                    Afficher l'icône
                  </span>
                </label>

                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={siteConfig.logo.showText}
                    onChange={(e) => handleLogoChange('showText', e.target.checked)}
                    className="rounded border-slate-300 text-orange-600 focus:ring-orange-500"
                  />
                  <span className="ml-2 text-sm text-slate-700 dark:text-slate-300">
                    Afficher le texte
                  </span>
                </label>
              </div>
            </div>
          </div>

          {/* Logo Preview */}
          <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-6">
            <h4 className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-4">
              Aperçu du logo
            </h4>
            <div className="flex items-center space-x-3 p-4 bg-white dark:bg-slate-700 rounded-lg border">
              {siteConfig.logo.showIcon && (
                <div className="bg-gradient-to-r from-orange-500 to-orange-600 p-2 rounded-lg">
                  {(() => {
                    const Icon = iconOptions.find(opt => opt.name === siteConfig.logo.icon)?.icon || BookOpen;
                    return <Icon className="h-6 w-6 text-white" />;
                  })()}
                </div>
              )}
              {siteConfig.logo.showText && (
                <div>
                  <h1 className="text-xl font-bold text-slate-900 dark:text-white">
                    {siteConfig.logo.text}
                  </h1>
                  <p className="text-xs text-slate-600 dark:text-slate-400">
                    {siteConfig.logo.subtitle}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Hero Tab */}
      {activeTab === 'hero' && (
        <div className="space-y-6">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
            Configuration de la page d'accueil
          </h3>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Titre principal
                </label>
                <input
                  type="text"
                  value={siteConfig.hero.title}
                  onChange={(e) => handleHeroChange('title', e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-orange-500 dark:bg-slate-700 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Sous-titre
                </label>
                <textarea
                  value={siteConfig.hero.subtitle}
                  onChange={(e) => handleHeroChange('subtitle', e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-orange-500 dark:bg-slate-700 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Image de fond (URL)
                </label>
                <input
                  type="url"
                  value={siteConfig.hero.backgroundImage}
                  onChange={(e) => handleHeroChange('backgroundImage', e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-orange-500 dark:bg-slate-700 dark:text-white"
                  placeholder="https://example.com/image.jpg"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Bouton principal
                  </label>
                  <input
                    type="text"
                    value={siteConfig.hero.ctaButtons.primary.text}
                    onChange={(e) => handleHeroChange('ctaButtons.primary', { ...siteConfig.hero.ctaButtons.primary, text: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-orange-500 dark:bg-slate-700 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Bouton secondaire
                  </label>
                  <input
                    type="text"
                    value={siteConfig.hero.ctaButtons.secondary.text}
                    onChange={(e) => handleHeroChange('ctaButtons.secondary', { ...siteConfig.hero.ctaButtons.secondary, text: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-orange-500 dark:bg-slate-700 dark:text-white"
                  />
                </div>
              </div>
            </div>

            {/* Statistics Configuration */}
            <div className="space-y-4">
              <h4 className="text-md font-semibold text-slate-900 dark:text-white">
                Statistiques
              </h4>
              
              {Object.entries(siteConfig.hero.stats).map(([key, stat]) => (
                <div key={key} className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    value={stat.value}
                    onChange={(e) => handleHeroChange(`stats.${key}`, { ...stat, value: e.target.value })}
                    className="px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-orange-500 dark:bg-slate-700 dark:text-white"
                    placeholder="Valeur"
                  />
                  <input
                    type="text"
                    value={stat.label}
                    onChange={(e) => handleHeroChange(`stats.${key}`, { ...stat, label: e.target.value })}
                    className="px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-orange-500 dark:bg-slate-700 dark:text-white"
                    placeholder="Label"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Hero Preview */}
          {previewMode && (
            <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-6">
              <h4 className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-4">
                Aperçu de la section héro
              </h4>
              <div 
                className="relative bg-gradient-to-r from-slate-900 to-slate-800 text-white p-8 rounded-lg"
                style={{
                  backgroundImage: `url(${siteConfig.hero.backgroundImage})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center'
                }}
              >
                <div className="absolute inset-0 bg-slate-900/70 rounded-lg"></div>
                <div className="relative">
                  <h1 className="text-2xl font-bold mb-4">
                    {siteConfig.hero.title}
                  </h1>
                  <p className="text-slate-300 mb-6">
                    {siteConfig.hero.subtitle}
                  </p>
                  <div className="flex gap-4">
                    <button className="px-4 py-2 bg-orange-500 text-white rounded-lg text-sm">
                      {siteConfig.hero.ctaButtons.primary.text}
                    </button>
                    <button className="px-4 py-2 border border-white text-white rounded-lg text-sm">
                      {siteConfig.hero.ctaButtons.secondary.text}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Theme Tab */}
      {activeTab === 'theme' && (
        <div className="space-y-6">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
            Configuration des couleurs
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Couleur principale
              </label>
              <div className="flex items-center space-x-2">
                <input
                  type="color"
                  value={siteConfig.theme.primaryColor}
                  onChange={(e) => handleThemeChange('primaryColor', e.target.value)}
                  className="w-12 h-10 rounded border border-slate-300"
                />
                <input
                  type="text"
                  value={siteConfig.theme.primaryColor}
                  onChange={(e) => handleThemeChange('primaryColor', e.target.value)}
                  className="flex-1 px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-orange-500 dark:bg-slate-700 dark:text-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Couleur secondaire
              </label>
              <div className="flex items-center space-x-2">
                <input
                  type="color"
                  value={siteConfig.theme.secondaryColor}
                  onChange={(e) => handleThemeChange('secondaryColor', e.target.value)}
                  className="w-12 h-10 rounded border border-slate-300"
                />
                <input
                  type="text"
                  value={siteConfig.theme.secondaryColor}
                  onChange={(e) => handleThemeChange('secondaryColor', e.target.value)}
                  className="flex-1 px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-orange-500 dark:bg-slate-700 dark:text-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Couleur d'accent
              </label>
              <div className="flex items-center space-x-2">
                <input
                  type="color"
                  value={siteConfig.theme.accentColor}
                  onChange={(e) => handleThemeChange('accentColor', e.target.value)}
                  className="w-12 h-10 rounded border border-slate-300"
                />
                <input
                  type="text"
                  value={siteConfig.theme.accentColor}
                  onChange={(e) => handleThemeChange('accentColor', e.target.value)}
                  className="flex-1 px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-orange-500 dark:bg-slate-700 dark:text-white"
                />
              </div>
            </div>
          </div>

          {/* Theme Preview */}
          <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-6">
            <h4 className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-4">
              Aperçu des couleurs
            </h4>
            <div className="flex space-x-4">
              <div className="text-center">
                <div 
                  className="w-16 h-16 rounded-lg mb-2"
                  style={{ backgroundColor: siteConfig.theme.primaryColor }}
                ></div>
                <p className="text-xs text-slate-600 dark:text-slate-400">Principale</p>
              </div>
              <div className="text-center">
                <div 
                  className="w-16 h-16 rounded-lg mb-2"
                  style={{ backgroundColor: siteConfig.theme.secondaryColor }}
                ></div>
                <p className="text-xs text-slate-600 dark:text-slate-400">Secondaire</p>
              </div>
              <div className="text-center">
                <div 
                  className="w-16 h-16 rounded-lg mb-2"
                  style={{ backgroundColor: siteConfig.theme.accentColor }}
                ></div>
                <p className="text-xs text-slate-600 dark:text-slate-400">Accent</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Save Button */}
      <div className="flex justify-end pt-6 border-t border-slate-200 dark:border-slate-700">
        <button
          className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors flex items-center"
        >
          <Save className="h-4 w-4 mr-2" />
          Sauvegarder les modifications
        </button>
      </div>
    </div>
  );
}