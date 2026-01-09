// Share Service - Social media and native sharing
import { Share, Linking, Alert, Platform } from 'react-native';
import * as Sharing from 'expo-sharing';
import { Project } from '@/shared';

class ShareService {
  /**
   * Share using native share sheet
   */
  async shareNative(project: Project): Promise<boolean> {
    if (!project.published_url) {
      Alert.alert('Error', 'Este proyecto no ha sido publicado aún');
      return false;
    }

    try {
      const result = await Share.share({
        message: this.getShareMessage(project),
        url: project.published_url,
        title: this.getProjectTitle(project),
      });

      return result.action === Share.sharedAction;
    } catch (error) {
      console.error('Error sharing:', error);
      return false;
    }
  }

  /**
   * Share to WhatsApp
   */
  async shareToWhatsApp(project: Project): Promise<void> {
    if (!project.published_url) {
      Alert.alert('Error', 'Este proyecto no ha sido publicado aún');
      return;
    }

    const message = this.getShareMessage(project);
    const url = `whatsapp://send?text=${encodeURIComponent(message)}`;

    try {
      const canOpen = await Linking.canOpenURL(url);
      if (canOpen) {
        await Linking.openURL(url);
      } else {
        Alert.alert('WhatsApp no disponible', 'Instala WhatsApp para compartir');
      }
    } catch (error) {
      console.error('Error sharing to WhatsApp:', error);
      Alert.alert('Error', 'No se pudo abrir WhatsApp');
    }
  }

  /**
   * Share to Facebook
   */
  async shareToFacebook(project: Project): Promise<void> {
    if (!project.published_url) {
      Alert.alert('Error', 'Este proyecto no ha sido publicado aún');
      return;
    }

    // Facebook sharing requires Facebook SDK or web share dialog
    const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(project.published_url)}`;

    try {
      await Linking.openURL(url);
    } catch (error) {
      console.error('Error sharing to Facebook:', error);
      Alert.alert('Error', 'No se pudo abrir Facebook');
    }
  }

  /**
   * Share to Instagram (Stories)
   */
  async shareToInstagram(imageUri: string): Promise<void> {
    try {
      // Check if Expo Sharing is available
      const isAvailable = await Sharing.isAvailableAsync();

      if (!isAvailable) {
        Alert.alert('Error', 'No se puede compartir en este dispositivo');
        return;
      }

      // Instagram sharing requires specific format
      // This will open the system share sheet
      await Sharing.shareAsync(imageUri, {
        dialogTitle: 'Compartir en Instagram',
      });
    } catch (error) {
      console.error('Error sharing to Instagram:', error);
      Alert.alert('Error', 'No se pudo compartir a Instagram');
    }
  }

  /**
   * Share to Twitter/X
   */
  async shareToTwitter(project: Project): Promise<void> {
    if (!project.published_url) {
      Alert.alert('Error', 'Este proyecto no ha sido publicado aún');
      return;
    }

    const text = this.getShareMessage(project);
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`;

    try {
      await Linking.openURL(url);
    } catch (error) {
      console.error('Error sharing to Twitter:', error);
      Alert.alert('Error', 'No se pudo abrir Twitter');
    }
  }

  /**
   * Share via Email
   */
  async shareViaEmail(project: Project): Promise<void> {
    if (!project.published_url) {
      Alert.alert('Error', 'Este proyecto no ha sido publicado aún');
      return;
    }

    const subject = encodeURIComponent(`Invitación: ${this.getProjectTitle(project)}`);
    const body = encodeURIComponent(this.getEmailBody(project));
    const url = `mailto:?subject=${subject}&body=${body}`;

    try {
      await Linking.openURL(url);
    } catch (error) {
      console.error('Error sharing via email:', error);
      Alert.alert('Error', 'No se pudo abrir el correo');
    }
  }

  /**
   * Share via SMS
   */
  async shareViaSMS(project: Project): Promise<void> {
    if (!project.published_url) {
      Alert.alert('Error', 'Este proyecto no ha sido publicado aún');
      return;
    }

    const message = this.getShareMessage(project);
    const url = Platform.OS === 'ios'
      ? `sms:&body=${encodeURIComponent(message)}`
      : `sms:?body=${encodeURIComponent(message)}`;

    try {
      await Linking.openURL(url);
    } catch (error) {
      console.error('Error sharing via SMS:', error);
      Alert.alert('Error', 'No se pudo abrir mensajes');
    }
  }

  /**
   * Copy link to clipboard
   */
  async copyLink(project: Project): Promise<void> {
    if (!project.published_url) {
      Alert.alert('Error', 'Este proyecto no ha sido publicado aún');
      return;
    }

    // Note: Clipboard API would be needed here
    // For now, just show the URL
    Alert.alert(
      'Link copiado',
      project.published_url,
      [{ text: 'OK' }]
    );
  }

  /**
   * Get share message
   */
  private getShareMessage(project: Project): string {
    const title = this.getProjectTitle(project);
    return `¡Mira mi invitación!\n\n${title}\n\n${project.published_url}`;
  }

  /**
   * Get email body
   */
  private getEmailBody(project: Project): string {
    const title = this.getProjectTitle(project);
    return `Hola,\n\nTe invito a ver mi invitación:\n\n${title}\n\n${project.published_url}\n\n¡Espero contar con tu presencia!\n\nCreado con InvitationWeb`;
  }

  /**
   * Get project title
   */
  private getProjectTitle(project: Project): string {
    if (typeof project.website_data === 'string') {
      try {
        const data = JSON.parse(project.website_data);
        return typeof data.hero?.title === 'string'
          ? data.hero.title
          : data.hero?.title?.es || 'Mi Invitación';
      } catch {
        return 'Mi Invitación';
      }
    }

    const title = project.website_data?.hero?.title;
    return typeof title === 'string'
      ? title
      : title?.es || 'Mi Invitación';
  }

  /**
   * Show share options modal
   */
  showShareOptions(project: Project): void {
    if (!project.published_url) {
      Alert.alert('Error', 'Este proyecto no ha sido publicado aún');
      return;
    }

    Alert.alert(
      'Compartir invitación',
      'Elige una opción',
      [
        {
          text: 'WhatsApp',
          onPress: () => this.shareToWhatsApp(project),
        },
        {
          text: 'Facebook',
          onPress: () => this.shareToFacebook(project),
        },
        {
          text: 'Email',
          onPress: () => this.shareViaEmail(project),
        },
        {
          text: 'SMS',
          onPress: () => this.shareViaSMS(project),
        },
        {
          text: 'Más opciones',
          onPress: () => this.shareNative(project),
        },
        {
          text: 'Cancelar',
          style: 'cancel',
        },
      ],
      { cancelable: true }
    );
  }
}

export const shareService = new ShareService();
export default shareService;
