<?php
/**
 * Input and label into input-column3.
 *
 * @author Janne Vaaraniemi
 */
class Oibs_Form_Decorator_CheckBoxDecorator extends Zend_Form_Decorator_Abstract
{

    public function buildLabel()
    {
        $element = $this->getElement();
        $label = $element->getLabel();

        if ($translator = $element->getTranslator()) {
            $label = $translator->translate($label);
        }

        return '<span class="inuse">'.$label.'</span>';
        return $element->getView()
                       ->formLabel($element->getName(), $label);
    }

    public function buildInput()
    {
        $element = $this->getElement();
        $helper  = $element->helper;
        $element->setAttrib('class', 'checkbox');
        return $element->getView()->$helper(
            $element->getName(),
            $element->getValue(),
            $element->getAttribs(),
            $element->options
        );
    }

    public function buildErrors()
    {
        $element  = $this->getElement();
        $messages = $element->getMessages();
        if (empty($messages)) {
            return '';
        }
        return '<div class="errors">' .
               $element->getView()->formErrors($messages) . '</div>';
    }

    public function buildDescription()
    {
        $element = $this->getElement();
        $desc    = $element->getDescription();
        if (empty($desc)) {
            return '';
        }
        return $desc;
    }

    public function render($content)
    {
        $element = $this->getElement();
        if (!$element instanceof Zend_Form_Element) {
            return $content;
        }
        if (null === $element->getView()) {
            return $content;
        }

        $separator = $this->getSeparator();
        $placement = $this->getPlacement();
        $label     = $this->buildLabel();
        $input     = $this->buildInput();
        $errors    = $this->buildErrors();
        $desc      = $this->buildDescription();

        $output = '<div class="input-column3"> '
                . $input
                . $label
                . '</div>'
                . '<div class="clear"></div>'
                . $errors;

        switch ($placement) {
            case (self::PREPEND):
                return $output . $separator . $content;
            case (self::APPEND):
            default:
                return $content . $separator . $output;
        }
    }
}
?>
