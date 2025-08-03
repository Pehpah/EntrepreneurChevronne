-- Création des tables pour le blog

-- Table des catégories
CREATE TABLE IF NOT EXISTS categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  description TEXT,
  icon VARCHAR(255),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table des articles
CREATE TABLE IF NOT EXISTS articles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title VARCHAR(500) NOT NULL,
  excerpt TEXT,
  content TEXT NOT NULL,
  category VARCHAR(255) NOT NULL,
  author VARCHAR(255) NOT NULL,
  published_at DATE DEFAULT CURRENT_DATE,
  read_time INTEGER DEFAULT 1,
  image VARCHAR(1000),
  tags TEXT[] DEFAULT '{}',
  featured BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table des préférences utilisateur
CREATE TABLE IF NOT EXISTS user_preferences (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id VARCHAR(255) NOT NULL,
  theme VARCHAR(10) DEFAULT 'light' CHECK (theme IN ('light', 'dark')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Table des abonnés newsletter
CREATE TABLE IF NOT EXISTS newsletter_subscribers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  subscribed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  active BOOLEAN DEFAULT TRUE
);

-- Insertion des catégories par défaut
INSERT INTO categories (name, slug, description, icon) VALUES
('Gestion Quotidienne', 'gestion-quotidienne', 'Optimisez votre gestion d''entreprise au quotidien', 'Calendar'),
('Stratégie', 'strategie', 'Développez une stratégie d''entreprise gagnante', 'Target'),
('Marketing', 'marketing', 'Boostez votre visibilité et vos ventes', 'TrendingUp'),
('Finance', 'finance', 'Maîtrisez vos finances d''entreprise', 'DollarSign'),
('Productivité', 'productivite', 'Augmentez votre efficacité professionnelle', 'Zap'),
('Témoignages', 'temoignages', 'Découvrez les success stories d''entrepreneurs', 'Users')
ON CONFLICT (slug) DO NOTHING;

-- Insertion d'articles d'exemple
INSERT INTO articles (title, excerpt, content, category, author, image, tags, featured) VALUES
(
  'Les clés d''une gestion quotidienne efficace',
  'Découvrez les stratégies essentielles pour optimiser votre gestion d''entreprise au quotidien et gagner en productivité.',
  'La gestion quotidienne d''une entreprise peut rapidement devenir un défi majeur pour tout entrepreneur. Entre les tâches administratives, la gestion des équipes et le suivi des projets, il est facile de se sentir débordé.

Dans cet article, nous allons explorer les meilleures pratiques pour une gestion quotidienne efficace :

## 1. Planification stratégique

La planification est la clé du succès. Commencez chaque semaine en définissant vos priorités et objectifs. Utilisez des outils comme :
- Calendriers partagés
- Applications de gestion de tâches
- Tableaux de bord de suivi

## 2. Automatisation des processus

L''automatisation vous permet de gagner un temps précieux. Identifiez les tâches répétitives et trouvez des solutions pour les automatiser.

## 3. Communication efficace

Mettez en place des canaux de communication clairs avec vos équipes. Des réunions courtes mais régulières peuvent faire toute la différence.',
  'gestion-quotidienne',
  'Entrepreneur Chevronné',
  'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg',
  ARRAY['gestion', 'productivité', 'organisation', 'planification'],
  true
),
(
  'Développer une stratégie d''entreprise gagnante',
  'Comment élaborer une stratégie d''entreprise solide qui vous permettra de vous démarquer de la concurrence.',
  'Une stratégie d''entreprise bien définie est le fondement de tout succès entrepreneurial. Elle vous guide dans vos décisions et vous aide à atteindre vos objectifs à long terme.

## Les éléments clés d''une stratégie réussie

### 1. Analyse du marché
Comprendre votre marché est essentiel. Analysez :
- Vos concurrents
- Les tendances du secteur
- Les besoins de vos clients

### 2. Définition de votre proposition de valeur
Qu''est-ce qui vous différencie ? Votre proposition de valeur doit être claire et convaincante.

### 3. Fixation d''objectifs SMART
Vos objectifs doivent être Spécifiques, Mesurables, Atteignables, Réalistes et Temporellement définis.',
  'strategie',
  'Entrepreneur Chevronné',
  'https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg',
  ARRAY['stratégie', 'business', 'croissance', 'objectifs'],
  true
);

-- Création des index pour optimiser les performances
CREATE INDEX IF NOT EXISTS idx_articles_category ON articles(category);
CREATE INDEX IF NOT EXISTS idx_articles_published_at ON articles(published_at DESC);
CREATE INDEX IF NOT EXISTS idx_articles_featured ON articles(featured) WHERE featured = true;
CREATE INDEX IF NOT EXISTS idx_user_preferences_user_id ON user_preferences(user_id);

-- Fonction pour mettre à jour automatiquement updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger pour mettre à jour updated_at automatiquement
CREATE TRIGGER update_articles_updated_at BEFORE UPDATE ON articles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_preferences_updated_at BEFORE UPDATE ON user_preferences
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();